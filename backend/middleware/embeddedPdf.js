import express from "express";
import multer from "multer";
import fetch from "node-fetch"; // npm install node-fetch
import {PDFDocument} from "pdf-lib";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()}); // memory only

router.post("/", upload.fields([
    {name: "pdf", maxCount: 1},
]), async (req, res) => {
    try {
        const pdfFile = req.files?.pdf?.[0];
        const {invoice_id, uuid, xml_url} = req.body;

        if (!pdfFile) {
            return res.status(400).send("Missing PDF file");
        }
        if (!invoice_id || !uuid) {
            return res.status(400).send("Missing invoice_id or uuid");
        }

        // Load PDF and embed XML
        const pdfDoc = await PDFDocument.load(pdfFile.buffer);

        // Fetch XML from URL
        const response = await fetch(xml_url);
        if (!response.ok) {
            throw new Error(`Failed to fetch XML from ${xml_url}`);
        }
        const xmlBuffer = Buffer.from(await response.arrayBuffer());

        // Get last segment after "/"
        const lastSegment = xml_url.substring(xml_url.lastIndexOf("/") + 1);
        const fileName = lastSegment.replace(".xml", "");


        pdfDoc.attach(xmlBuffer, fileName + ".xml", {
            mimeType: "text/xml",
            description: "ZATCA Invoice XML",
        });

        const modifiedPdf = await pdfDoc.save();
        const pdfFileName = fileName + ".pdf";

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${pdfFileName}`);
        res.send(Buffer.from(modifiedPdf));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error embedding XML in PDF");
    }
});

export default router;