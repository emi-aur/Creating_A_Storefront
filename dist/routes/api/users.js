"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserModel = __importStar(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../../middleware/auth");
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const tokenSecret = process.env.TOKEN_SECRET;
const users = express_1.default.Router();
/**
 * 0. LOGIN: User authentifizieren und Token erhalten
 * POST /users/login
 */
users.post("/login", async (req, res) => {
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
    const token = jsonwebtoken_1.default.sign(
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
users.get("/", auth_1.verifyAuthToken, async (req, res) => {
  try {
    const allUsers = await UserModel.index(); // Annahme: Methode index() gibt alles zurück
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Laden der User-Liste." });
  }
});
/**
 * 2. SHOW: Einen spezifischen User via ID abrufen [TOKEN REQUIRED]
 * GET /users/:id
 */
users.get("/:id", auth_1.verifyAuthToken, async (req, res) => {
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
});
/**
 * 3. CREATE: Einen neuen User erstellen
 * POST /users/
 */
users.post("/", async (req, res) => {
  const { firstname, lastname, password } = req.body;
  if (!firstname || !lastname || !password) {
    return res
      .status(400)
      .json({ error: "Vorname, Nachname und Passwort sind erforderlich." });
  }
  try {
    const password_digest = bcrypt_1.default.hashSync(
      password + pepper,
      saltRounds
    );
    const newUser = await UserModel.create({
      firstname,
      lastname,
      password_digest,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "User konnte nicht erstellt werden." });
  }
});
exports.default = users;
