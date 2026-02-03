import express from "express";
import * as ProductModel from "../../models/products";

const products = express.Router();

products.get("/", async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        const allProducts = await ProductModel.index(); // Annahme: Methode index() gibt alles zurück
        res.status(200).json(allProducts);      
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der Produktliste.' });
    }
});

products.get("/:id", async (req: express.Request<{id: string}>, res: express.Response) => {
    const { id } = req.params;
    try {
        const productData = await ProductModel.show(id);
        if (!productData) {
            return res.status(404).json({ error: 'Produkt nicht gefunden.' });
        }
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Produkts.' });
    }
});

products.post("/", async (req: express.Request<{}, {}, {name: string; price: number}>, res: express.Response) => {
    const { name, price } = req.body;
    try {
        const newProduct = await ProductModel.create({ name, price });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Produkt konnte nicht erstellt werden.' });
    }
});

export default products;