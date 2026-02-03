import express from "express";
import * as UserModel from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyAuthToken } from "../../middleware/auth";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
const tokenSecret = process.env.TOKEN_SECRET as string;

const users = express.Router();

interface UserBody {
  firstname: string;
  lastname: string;
  password?: string; // Optional, falls beim Erstellen benötigt
}

interface UserParams {
  id: string;
}

/**
 * 0. LOGIN: User authentifizieren und Token erhalten
 * POST /users/login
 */
users.post("/login", async (req: express.Request, res: express.Response) => {
  const { firstname, lastname, password } = req.body;

  if (!firstname || !lastname || !password) {
    return res
      .status(400)
      .json({ error: "Firstname, Lastname und Password sind erforderlich." });
  }

  try {
    const user = await UserModel.authenticate(firstname, lastname, password);

    if (!user) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten." });
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      },
      tokenSecret
    );

    res.status(200).json({
      user: { id: user.id, firstname: user.firstname, lastname: user.lastname },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Fehler bei der Anmeldung." });
  }
});

/**
 * 1. INDEX: Alle User abrufen [TOKEN REQUIRED]
 * GET /users/
 */
users.get(
  "/",
  verifyAuthToken,
  async (req: express.Request, res: express.Response) => {
    try {
      const allUsers = await UserModel.index(); // Annahme: Methode index() gibt alles zurück
      res.status(200).json(allUsers);
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Laden der User-Liste." });
    }
  }
);

/**
 * 2. SHOW: Einen spezifischen User via ID abrufen [TOKEN REQUIRED]
 * GET /users/:id
 */
users.get(
  "/:id",
  verifyAuthToken,
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const userData = await UserModel.show(id);
      if (!userData) {
        return res.status(404).json({ error: "User nicht gefunden." });
      }
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ error: "Fehler beim Abrufen des Users." });
    }
  }
);

/**
 * 3. CREATE: Einen neuen User erstellen
 * POST /users/
 */
users.post(
  "/",
  async (req: express.Request<{}, {}, UserBody>, res: express.Response) => {
    const { firstname, lastname, password } = req.body;

    if (!firstname || !lastname || !password) {
      return res
        .status(400)
        .json({ error: "Vorname, Nachname und Passwort sind erforderlich." });
    }

    try {
      const password_digest = bcrypt.hashSync(password + pepper, saltRounds);

      const newUser = await UserModel.create({
        firstname,
        lastname,
        password_digest,
      });

      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: "User konnte nicht erstellt werden." });
    }
  }
);

export default users;
