import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateInvoiceNo } from "@/lib/invoice";

const DISCOUNT_RATE = 0.05;

export async function POST(req) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, message: "Silakan login." }, { status: 401 });
    }

    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const memberId = body.member_id || null;
    const paymentMethod = body.payment_method;
    const paidAmountInput = Number(body.paid_amount);

    if (items.length === 0) {
        return NextResponse.json({ success: false, message: "Keranjang kosong." }, { status: 400 });
    }

    if (paymentMethod !== "tunai" && paymentMethod !== "qris") {
        return NextResponse.json({ success: false, message: "Metode pembayaran tidak valid." }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const ids = items.map((i) => i.id);
        const [products] = await connection.query(
            "SELECT id, name, price, stock FROM products WHERE id IN (?) FOR UPDATE",
            [ids]
        );
        const productMap = new Map(products.map((p) => [p.id, p]));

        let subtotal = 0;
        const preparedItems = [];

        for (const item of items) {
            const product = productMap.get(item.id);
            const qty = Number(item.qty);

            if (!product || !Number.isInteger(qty) || qty < 1) {
                throw new Error("Data barang tidak valid.");
            }
            if (qty > product.stock) {
                throw new Error("Stok " + product.name + " tidak cukup (sisa " + product.stock + ").");
            }

            const lineTotal = product.price * qty;
            subtotal += lineTotal;
            preparedItems.push({
                product_id: product.id,
                product_name: product.name,
                price: product.price,
                qty: qty,
                subtotal: lineTotal,
            });
        }

        let discount = 0;
        if (memberId) {
            const [memberRows] = await connection.query("SELECT id FROM members WHERE id = ? LIMIT 1", [memberId]);
            if (memberRows.length > 0) {
                discount = Math.round(subtotal * DISCOUNT_RATE);
            }
        }

        const total = subtotal - discount;
        let paidAmount = paidAmountInput;
        let changeAmount = 0;

        if (paymentMethod === "qris") {
            paidAmount = total;
        } else {
            if (!Number.isFinite(paidAmount) || paidAmount < total) {
                throw new Error("Uang yang diterima kurang dari total belanja.");
            }
            changeAmount = paidAmount - total;
        }

        const invoiceNo = generateInvoiceNo();

        const [txResult] = await connection.query(
            `INSERT INTO transactions
                (invoice_no, user_id, member_id, subtotal, discount, total, payment_method, paid_amount, change_amount)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [invoiceNo, session.id, memberId, subtotal, discount, total, paymentMethod, paidAmount, changeAmount]
        );
        const transactionId = txResult.insertId;

        for (const item of preparedItems) {
            await connection.query(
                `INSERT INTO transaction_items (transaction_id, product_id, product_name, price, qty, subtotal)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [transactionId, item.product_id, item.product_name, item.price, item.qty, item.subtotal]
            );

            const [updateResult] = await connection.query(
                "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
                [item.qty, item.product_id, item.qty]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error("Stok " + item.product_name + " berubah, silakan ulangi.");
            }
        }

        await connection.commit();

        return NextResponse.json({ success: true, transaction_id: transactionId, invoice_no: invoiceNo });
    } catch (err) {
        await connection.rollback();
        console.error("Checkout error:", err);
        return NextResponse.json({ success: false, message: err.message || "Checkout gagal." }, { status: 400 });
    } finally {
        connection.release();
    }
}