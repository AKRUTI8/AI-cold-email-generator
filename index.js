import express, { json } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import emailRoutes from "./src/routes/emailRoute.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", emailRoutes);

// health endpoint
app.get("/health", (_, res) => {
	res.send("AI Cold Email Generator API is running").status(200);
});

// Route to render HTML page
app.get("*", (_, res) => {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Start server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
