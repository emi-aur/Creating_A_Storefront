import Client from "../database";

export type Product = {
    id?: number;
    name: string;
    price: number;  
}

export const index = async (): Promise<Product[]> => {
    try {
        const conn = await Client.connect();
        const sql = 'SELECT * FROM products';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    } catch (err) {
        throw new Error(`Fehler beim Laden der Produkte: ${err}`);
    }
}

export const show = async (id:string): Promise<Product> => {
    try {
        const conn = await Client.connect();
        const sql = 'SELECT * FROM products WHERE id=($1)';
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    } catch (err) {
        throw new Error(`Fehler beim Finden des Produkts: ${err}`);
    }
}

export const create = async (p:Product): Promise<Product> => {
    try { 
        const conn = await Client.connect();
        const sql = 'INSERT INTO product (name, price) VALUES($1,$2) RETURNING *';
        const result = await conn.query(sql, [p.name, p.price]);
        const product = result.rows[0];
        conn.release();
        return product; 
    }   catch (err) {
        throw new Error(`Fehler beim Erstellen des Produkts: ${err}`);
    }   
}