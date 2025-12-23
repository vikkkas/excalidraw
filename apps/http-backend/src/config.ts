import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const PORT = process.env.PORT || 3005;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";