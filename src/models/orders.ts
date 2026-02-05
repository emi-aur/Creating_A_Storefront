import Client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  order_status: boolean;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export type OrderWithProducts = Order & {
  products?: {
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
  }[];
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

// OrderProducts-Funktionen
export const addProductToOrder = async (
  orderProduct: OrderProduct
): Promise<OrderProduct> => {
  try {
    const conn = await Client.connect();
    const sql =
      "INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *";
    const result = await conn.query(sql, [
      orderProduct.order_id,
      orderProduct.product_id,
      orderProduct.quantity,
    ]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(
      `Fehler beim Hinzufügen des Produkts zur Bestellung: ${err}`
    );
  }
};

export const getOrderWithProducts = async (
  orderId: string
): Promise<OrderWithProducts | null> => {
  try {
    const conn = await Client.connect();

    // Hole die Bestellung
    const orderSql = "SELECT * FROM orders WHERE id=$1";
    const orderResult = await conn.query(orderSql, [orderId]);

    if (orderResult.rows.length === 0) {
      conn.release();
      return null;
    }

    const order = orderResult.rows[0];

    // Hole die Produkte für diese Bestellung
    const productsSql = `
      SELECT 
        op.product_id,
        p.name as product_name,
        op.quantity,
        p.price
      FROM order_products op
      INNER JOIN products p ON op.product_id = p.id
      WHERE op.order_id=$1
    `;
    const productsResult = await conn.query(productsSql, [orderId]);

    conn.release();

    return {
      ...order,
      products: productsResult.rows,
    };
  } catch (err) {
    throw new Error(`Fehler beim Laden der Bestellung mit Produkten: ${err}`);
  }
};
