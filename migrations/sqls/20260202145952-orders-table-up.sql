
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    id_product INTEGER,
    quantity_product NUMERIC,
    user_id INTEGER,
    order_status BOOLEAN,

    -- Definition der Foreign Keys
    CONSTRAINT fk_products 
        FOREIGN KEY (id_product) 
        REFERENCES products (id),
        
    CONSTRAINT fk_users 
        FOREIGN KEY (user_id) 
        REFERENCES users (id)
);