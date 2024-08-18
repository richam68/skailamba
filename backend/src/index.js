const mongoose = require("mongoose");
const app = require("./app");
const PORT = 8082;
const dotenv = require("dotenv");
const path = require('path');

//username: richamhshwr2
//qQzWaSHrd78wyDKL

dotenv.config({ path: path.join(__dirname, '../.env') });
console.log("env",process.env.JWT_SECRET)

mongoose.connect(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/QuesAi")
.then(() => console.log("Connected to DB at ", process.env.MONGODB_URL))
.catch(() => console.log("Failed to connect at DB at", process.env.MONGODB_URL));

app.listen(PORT, () => {
    console.log("Server is running on port 8082");
});