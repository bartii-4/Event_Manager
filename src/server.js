const app = require("./app");
const { connectDB } = require("./connection/db");

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server running: http://localhost:" + PORT);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to DB", err);
        process.exit(1);
    });