const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const accounts = [
    { name: "Administrator", username: "admin", password: "admin123", role: "admin" },
    { name: "Kasir", username: "kasir", password: "kasir123", role: "petugas" },
];

async function main() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    for (const acc of accounts) {
        const hash = await bcrypt.hash(acc.password, 10);

        await conn.query(
            "INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role), is_active = 1",
            [acc.name, acc.username, hash, acc.role]
        );

        console.log("Siap -> " + acc.role + " | username: " + acc.username + " | password: " + acc.password);
    }

    await conn.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});