import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const app: express.Application = express();
const host: string = "0.0.0.0";
const port: number = 3000;

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World<3");
});

app.use("/api", routes);

app.listen(port, host, function () {
  console.log(`Server läuft auf: http://localhost:${port}`);
});
