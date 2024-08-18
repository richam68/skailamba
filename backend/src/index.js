const mongoose = require("mongoose");
const app = require("./app");
const PORT = 8082;

//username: richamhshwr2
//qQzWaSHrd78wyDKL
//mongodb+srv://richamhshwr2:qQzWaSHrd78wyDKL@cluster0.yhcvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

mongoose.connect(PORT, {
    useNewUrlParser: true,
})
.then(() => console.log("Connected to DB at ", DB_URI))
.catch(() => console.log("Failed to connect at DB at", DB_URI));

app.listen(PORT, () => {
    console.log("Server is running on port 8082");
});