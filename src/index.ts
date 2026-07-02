import app from "./server.js";
import { connect } from "./lib/db.js";
import "dotenv/config";

connect().catch(err => console.log(err));
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log("Server is listening on port " + PORT))