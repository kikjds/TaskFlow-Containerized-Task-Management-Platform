import mongoose from "mongoose";
import "dotenv/config"

const DB_URL = process.env.DB_URL || ""

export async function connect() {
    await mongoose.connect(DB_URL)
}

