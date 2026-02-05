-- Füge die Spalten id_product und quantity_product wieder hinzu
ALTER TABLE orders 
    ADD COLUMN id_product INTEGER,
    ADD COLUMN quantity_product NUMERIC,
    ADD CONSTRAINT fk_products 
        FOREIGN KEY (id_product) 
        REFERENCES products (id);