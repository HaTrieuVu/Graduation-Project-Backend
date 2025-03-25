require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initApiRoutes from "./routes/api";
import initWebRoutes from "./routes/web";
import connectDB from "./config/connectDB";
import cookieParser from "cookie-parser";
// import cors from "cors";

let app = express();

// Config cors
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT_MAIN);

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Nếu request là OPTIONS (Preflight request), trả về 200 ngay
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//config cookie parser
app.use(cookieParser());

viewEngine(app);

// init web routes
initApiRoutes(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;

app.use((req, res) => {
    return res.send("404 Not Found!");
});

app.listen(port, () => {
    console.log("Backend NodeJS " + port);
});
