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
  if (!req.session.userid) {
    res.redirect("/registerlogin");
    return;
  }

  // Abrufen aller Rezepte aus der Datenbank mit den zugehörigen Nutzernamen
  const recipes = await app.locals.pool.query(
    "SELECT recipes.*, users.nutzername AS name FROM recipes INNER JOIN users ON recipes.user_id = users.id;"
  );
  res.render("start", { recipes: recipes.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

// Route für die Bewertungsseite
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
  res.redirect("/");
});

// POST-Route zum Verarbeiten einer neuen Bewertung für ein Rezept
app.post("/neuebewertung/:id", async function (req, res) {
  //await app.locals.pool.query(
  //  "INSERT INTO reviews (text, sterne, user_id, datum, recipe_id) VALUES ($1, $2, $3, current_timestamp, $4)",
  //  [req.body.kommentar, req.body.stars, req.session.userid, req.params.id]
  //);
  console.log("TEST");
  res.redirect("/" + req.params.id + "/bewertungen");
});

app.get("/neuebewertung/:id", function (req, res) {
  const id = req.params.id;
  res.render("neuebewertung", { id });
});

app.get("/:id/bewertungen", function (req, res) {
  const recipeId = req.params.id;

  app.locals.pool.query(
    "SELECT * FROM recipes WHERE id = $1",
    [recipeId],
    (err, recipeResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }

      if (recipeResult.rows.length === 0) {
        return res.status(404).send("Recipe not found");
      }

      const recipe = recipeResult.rows[0];

      // Now fetch the associated reviews
      app.locals.pool.query(
        "SELECT reviews.*, users.*\n" +
          "FROM reviews\n" +
          "INNER JOIN users ON reviews.user_id = users.id\n" +
          "WHERE reviews.recipe_id = $1;",
        [recipeId],
        (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).send("Server error");
          }

          if (result.rows.length === 0) {
            return res.status(404).send("Recipe not found");
          }

          const reviews = result.rows;
          res.render("bewertungen", { recipe, reviews });
        }
      );
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

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
