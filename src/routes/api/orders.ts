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
      const orderData = await OrderModel.show(id);
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
        order_id: number;
        quantity: number;
        order_status: boolean;
      }
    >,
    res: express.Response
  ) => {
    const { user_id, order_id, quantity, order_status } = req.body;
    try {
      const newOrder = await OrderModel.create({
        user_id,
        order_id,
        quantity,
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

export default orders;
