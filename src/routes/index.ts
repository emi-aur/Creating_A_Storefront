import express from "express";
import users from "./api/users";
import products from "./api/products";
import orders from "./api/orders";

const routes = express.Router();

routes.get("/", (req: express.Request, res: express.Response): void => {
  res.send("main image");
});

routes.use("/users", users);
routes.use("/products", products);
routes.use("/orders", orders);
export default routes;
