CREATE DATABASE IF NOT EXISTS risol_kasir
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE risol_kasir;

-- Akun admin dan petugas
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'petugas') NOT NULL DEFAULT 'petugas',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daftar barang jualan
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pelanggan member (opsional)
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Satu baris = satu nota
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(30) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    member_id INT NULL,
    subtotal INT NOT NULL,
    discount INT NOT NULL DEFAULT 0,
    total INT NOT NULL,
    payment_method ENUM('tunai', 'qris') NOT NULL,
    paid_amount INT NOT NULL,
    change_amount INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

-- Rincian barang di tiap nota
CREATE TABLE IF NOT EXISTS transaction_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NULL,
    product_name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    qty INT NOT NULL,
    subtotal INT NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Data awal: 5 varian dari poster (HARGA SEMENTARA, nanti diubah admin)
INSERT INTO products (name, description, price, stock) VALUES
    ('Risol Mayo Kepiting', 'Isi kepiting dengan mayo', 6000, 50),
    ('Risol Mayo Smoke Beef', 'Isi daging smoke beef', 6000, 50),
    ('Risol Mayo Sosis', 'Isi sosis dengan mayo', 5000, 50),
    ('Risol Mayo Sayuran & Ayam', 'Isi sayuran dan ayam', 5000, 50),
    ('Risol Mayo Kebab (Spesial)', 'Spesial isi daging kebab', 8000, 30);