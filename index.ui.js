import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const apiBaseUrl = process.env.URL_BACKEND || "http://localhost:8080";

//gms

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(publicDir));

app.get("/config.js", (_, res) => {
    res.type("application/javascript").send(`
        window.TAILSYNC_CONFIG = Object.freeze({
            apiBaseUrl: "${apiBaseUrl}"
        });
    `);
});

app.get("/", (_, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

//Route

app.all("*any", (req, res) => {
    return res.send("Endpoint not found!");
});

//Serve

app.listen(port, () => {
    console.log(`UI Server listening on port ${port}`);
});
