const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Models -----------------------------------------------------
const DocumentSchema = new mongoose.Schema({
  field1: String,
  field2: String,
  createdAt: { type: Date, default: Date.now },
});

const Document = mongoose.model("Document", DocumentSchema);

// API routes ------------------------------------------------

const validateDocument = (req, res, next) => {
  const { field1, field2 } = req.body;
  if (!field1 || !field2) return res.status(400).json({ error: "Both fields are required" });
  next();
}


// CREATE
app.post("/api/documents", validateDocument, async (req, res) => {
  try {
    console.log("Creating Comment:", req.body); // Debugging
    const document = new Document(req.body);
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// READ ALL
app.get("/api/documents", async (req, res) => {
  const documents = await Document.find();
  console.log("Receiving All Documents:", documents); // Debugging
  res.json(documents);
});


// READ BY ID
app.get("/api/documents/:documentId", async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);
    if (!document) return res.status(404).json({ error: "Document not found" });
    console.log("Receiving Document:", document); // Debugging
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// UPDATE BY ID
app.put("/api/documents/:documentId", async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.documentId, req.body, { new: true });
    if (!document) return res.status(404).json({ error: "Document not found" });
    console.log("Updating Document:", document); // Debugging
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// DELETE BY ID
app.delete("/api/documents/:documentId", async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.documentId);
    if (!document) return res.status(404).json({ error: "Document not found" });
    console.log("Deleting Document:", document); // Debugging
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Server ----------------------------------------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
