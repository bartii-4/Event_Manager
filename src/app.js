const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

const session = require("express-session");
app.use(
	session({
		secret: process.env.SESSION_SECRET || "keyboard cat",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 }
	})
);

app.use((req, res, next) => {
	res.locals.user = req.session.user || null;
	next();
});

app.get("/", (req, res) => {
	res.redirect("/events");
});

app.use("/", authRoutes);
app.use("/events", eventRoutes);

app.use((req, res) => {
	res.status(404).render('errors/404', { message: 'Strona nie znaleziona' });
});

module.exports = app;