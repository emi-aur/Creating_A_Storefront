import Client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  order_id: number;
  quantity: number;
  order_status: boolean;
};

export const index = async (): Promise<Order[]> => {
  try {
    const conn = await Client.connect();
    const sql = "SELECT * FROM orders";
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  } catch (err) {
    throw new Error(`Fehler beim Laden der Bestellungen: ${err}`);
  }
};

export const show = async (id: string): Promise<Order> => {
  try {
    const conn = await Client.connect();
    const sql = "SELECT * FROM orders WHERE id=($1)";
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Finden der Bestellung: ${err}`);
  }
};

export const create = async (o: Order): Promise<Order> => {
  try {
    const conn = await Client.connect();
    const sql =
      "INSERT INTO orders (user_id, order_status) VALUES($1,$2) RETURNING *";
    const result = await conn.query(sql, [o.user_id, o.order_status]);
    const order = result.rows[0];
    conn.release();
    return order;
  } catch (err) {
    throw new Error(`Fehler beim Erstellen der Bestellung: ${err}`);
  }
};
