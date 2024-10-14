import { createApp } from "./config.js";

const app = createApp({
  user: "autumn_star_7622",
  host: "168.119.168.41",
  database: "demo",
  password: "uaioysdfjoysfdf",
  port: 18324,
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
  //const explorerdaten
  res.render("explorer", {});
});

app.get("/bewertungen", async function (req, res) {
  res.render("bewertungen", {});
});

app.get("/create", async function (req, res) {
  res.render("createpost", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
