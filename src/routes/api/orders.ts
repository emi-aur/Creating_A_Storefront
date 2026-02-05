import express from "express";
import * as OrderModel from "../../models/orders";
import { verifyAuthToken } from "../../middleware/auth";

const orders = express.Router();

orders.get(
  "/",
  verifyAuthToken,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const allOrdes = await OrderModel.index();
      res.status(200).json(allOrdes);
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Laden der Bestellliste." });
    }
  }
);

orders.get(
  "/:id",
  async (req: express.Request<{ id: string }>, res: express.Response) => {
    const { id } = req.params;
    try {
      const orderData = await OrderModel.getOrderWithProducts(id);
      if (!orderData) {
        return res.status(404).json({ error: "Bestellung nicht gefunden." });
      }
      res.status(200).json(orderData);
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Abrufen der Bestellung." });
    }
  }
);

orders.post(
  "/",
  async (
    req: express.Request<
      {},
      {},
      {
        user_id: number;
        order_status: boolean;
      }
    >,
    res: express.Response
  ) => {
    const { user_id, order_status } = req.body;
    try {
      const newOrder = await OrderModel.create({
        user_id,
        order_status,
      });
      res.status(201).json(newOrder);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Bestellung konnte nicht erstellt werden." });
    }
  }
);

// Route zum Hinzufügen von Produkten zu einer Bestellung
orders.post(
  "/:id/products",
  verifyAuthToken,
  async (
    req: express.Request<
      { id: string },
      {},
      { product_id: number; quantity: number }
    >,
    res: express.Response
  ) => {
    const { id } = req.params;
    const { product_id, quantity } = req.body;

    try {
      const orderProduct = await OrderModel.addProductToOrder({
        order_id: parseInt(id),
        product_id,
        quantity,
      });
      res.status(201).json(orderProduct);
    } catch (err) {
      res.status(500).json({
        error: "Produkt konnte nicht zur Bestellung hinzugefügt werden."
      });
    }
  }
);


export default orders;
