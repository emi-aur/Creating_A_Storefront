-- Entferne die Spalten id_product und quantity_product aus der orders-Tabelle
ALTER TABLE orders 
    DROP COLUMN id_product,
    DROP COLUMN quantity_product;