import express from "express";
import * as UserModel from "../../models/user";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = parseInt(process.env.SALT_ROUNDS as string);

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
 * 1. INDEX: Alle User abrufen
 * GET /users/
 */
users.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const allUsers = await UserModel.index(); // Annahme: Methode index() gibt alles zurück
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der User-Liste.' });
    }
});

/**
 * 2. SHOW: Einen spezifischen User via ID abrufen
 * GET /users/:id
 */
users.get("/:id", async (req: express.Request<UserParams>, res: express.Response) => {
    const { id } = req.params;
    try {
        const userData = await UserModel.show(id);
        if (!userData) {
            return res.status(404).json({ error: 'User nicht gefunden.' });
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Users.' });
    }
});

/**
 * 3. CREATE: Einen neuen User erstellen
 * POST /users/
 */
users.post("/", async (req: express.Request<{}, {}, UserBody>, res: express.Response) => {
    const { firstname, lastname, password } = req.body;

    if (!firstname || !lastname || !password) {
        return res.status(400).json({ error: 'Vorname, Nachname und Passwort sind erforderlich.' });
    }

    try {
        const password_digest = bcrypt.hashSync(password + pepper, saltRounds);

        const newUser = await UserModel.create({
            firstname,
            lastname,
            password_digest
        });

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'User konnte nicht erstellt werden.' });
    }
});

export default users;