import { createApp } from "./config.js";

const app = createApp({
  user: "restless_sound_7211",
  host: "bbz.cloud",
  database: "restless_sound_7211",
  password: "bf44a5cece2c1d6bb52aede95a595f85",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  const anmeldung = await app.locals.pool.query("select * from users");
  res.render("start", { anmeldung: anmeldung.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/explorer", async function (req, res) {
  const recepies = await app.locals.pool.query(
    "SELECT recepies.*, users.nutzername AS name FROM recepies INNER JOIN users ON recepies.user_id = users.id;"
  );
  res.render("explorer", { recepies: recepies.rows });
});

app.get("/bewertungen", async function (req, res) {
  res.render("bewertungen", {});
});

app.get("/createpost", async function (req, res) {
  res.render("createpost", {});
});

app.post("/createpost", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO recepies (titel, bild, text, datum) VALUES ($1, $2, $3, current_timestamp)",
    [req.body.titel, req.body.bild, req.body.text]
  );
  res.redirect("/explorer");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
