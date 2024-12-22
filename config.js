import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
import cookieParser from "cookie-parser";
import multer from "multer";
import sessions from "express-session";
import bcrypt from "bcrypt";

const { Pool } = pg;

const upload = multer({ dest: "public/uploads/" });

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

  app.get("/start", function (res, req) {
    res.render("start");
  });

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

  // Erweiterung der Handlebars-Engine mit benutzerdefinierten Helper-Funktionen -> Für Sternebewertung
  app.engine(
    "handlebars",
    engine({
      helpers: {
        // Helper: Erstellt eine Schleife von 0 bis n
        range: function (n, block) {
          let accum = ""; // Ergebnis-String
          for (let i = 0; i < n; ++i) {
            accum += block.fn(i); // Fügt für jeden Iterationswert den HTML-Block hinzu
          }
          return accum; // Gibt den gesamten HTML-Block zurück
        },
        // Helper: Berechnet die Differenz zu 5
        diff: function (n, block) {
          return 5 - n; // Gibt den Unterschied zwischen 5 und n zurück
        },
      },
    })
  );

  return app;
}

export { upload };
