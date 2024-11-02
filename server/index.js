import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import cors from "cors";
import dotenv from "dotenv";
import {
  extractDocumentNumber,
  extractExpirationDate,
  extractName,
} from "./Regex.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const upload = multer({ dest: "uploads/" });

// OCR and data extraction route
app.post("/extract", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No document uploaded" });
    }

    const { path } = req.file;

    const result = await Tesseract.recognize(path, "eng");
    const extractedText = result.data.text;
    // console.log("Extracted Text:", extractedText);

    const name = extractName(extractedText);
    const documentNumber = extractDocumentNumber(extractedText);
    const expirationDate = extractExpirationDate(extractedText);

    return res.status(200).json({
      message: "Data Fetched",
      name,
      documentNumber,
      expirationDate,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Error processing document" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
