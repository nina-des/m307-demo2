import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bcrypt from "bcrypt";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;

  app.get("/registerlogin", function (req, res) {
    res.render("registerlogin");
  });

  app.post("/register", function (req, res) {
    var passwort = bcrypt.hashSync(req.body.passwort, 10);
    const result = pool.query(
      "INSERT INTO users (nutzername, email, passwort) VALUES ($1, $2, $3)",
      [req.body.nutzername, req.body.email, passwort],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        req.session.userid = result.rows[0].id;
        res.redirect("/");
      }
    );
  });

  app.get("/start", function (req, res) {
    pool.query("SELECT * FROM recipes", (error, result) => {
      if (error) {
        console.log(error);
      }
      const recipes = result;
      res.render("start", { recipes });
    });
  });

  app.post("/login", function (req, res) {
    pool.query(
      "SELECT * FROM users WHERE nutzername = $1",
      [req.body.nutzername],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (bcrypt.compareSync(req.body.passwort, result.rows[0].passwort)) {
          req.session.userid = result.rows[0].id;
          res.redirect("/");
        } else {
          res.redirect("/registerlogin");
        }
      }
    );
  });

  return app;
}

export { upload };
