import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";

const app: express.Application = express();
const host: string = "0.0.0.0";
const port: number = 3000;

// CORS aktivieren
app.use(cors());

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World<3");
});

app.use("/api", routes);

// Nur starten, wenn direkt ausgeführt (nicht in Tests)
if (require.main === module) {
  app.listen(port, host, function () {
    console.log(`Server läuft auf: http://localhost:${port}`);
  });
}

export default app;
