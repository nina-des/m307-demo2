import { createApp, upload } from "./config.js";

const app = createApp({
  user: "restless_sound_7211",
  host: "bbz.cloud",
  database: "restless_sound_7211",
  password: "bf44a5cece2c1d6bb52aede95a595f85",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  console.log("userid: ", req.session.userid);
  /*if (!req.session.userid) {
    res.redirect("/registerlogin");
    return;
  }*/
  const recipes = await app.locals.pool.query(
    "SELECT recipes.*, users.nutzername AS name FROM recipes INNER JOIN users ON recipes.user_id = users.id;"
  );
  res.render("start", { recipes: recipes.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/bewertungen", async function (req, res) {
  res.render("bewertungen", {});
});

app.get("/createpost", async function (req, res) {
  res.render("createpost", {});
});

app.post("/createpost", upload.single("bild"), async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO recipes (titel, bild, text, datum) VALUES ($1, $2, $3, current_timestamp)",
    [req.body.titel, req.body.bild, req.body.text]
  );
  res.redirect("/explorer");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
