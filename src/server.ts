import express from "express"
import taskRouter from "./route/task.route.js"
import authRouter from "./route/auth.route.js"
import session from "express-session"
import mongoStore from "connect-mongo"
import mongoose from "mongoose"
import "dotenv/config"
import cors from "cors"
import {connect} from "./lib/db.js"

declare module "express-session" {
    interface SessionData {
        username: string;
        userId: string;
    }
}

const ORIGIN = process.env.ORIGIN

const corsOptions = {
    origin: ORIGIN,
    methods: "GET,POST",
}
connect().catch(err => console.log(err));
const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false, limit: '1mb', parameterLimit: 5000}))
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    store: mongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: process.env.DB_NAME,
        collectionName: "sessions",
        ttl: 14 * 24 * 60 * 60,
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 14 * 24 * 60 * 60 * 1000 }
}))

//Routes
app.use(taskRouter)
//Auth routes
app.use(authRouter)

export default app