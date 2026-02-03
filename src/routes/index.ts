import express from "express";
import users from "./api/users";


const routes = express.Router();

routes.get("/", (req: express.Request, res: express.Response): void => {
  res.send("main image");
});

routes.use("/users", users);
export default routes;
