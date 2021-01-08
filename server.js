const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const context = require("./context");
const middlewares = require("./middlewares");
const repository = require("./repository");
const service = require("./service");

const port = 3000;

function main() {
  const app = express();

  const db = repository.InMemory(null);
  const userService = service.UsersService(db);
  const characterService = service.CharacterService(db);

  // Use handlebars as the template engine
  app.engine(
    "handlebars",
    exphbs({
      helpers: {
        includesId: function (list, id, options) {
          if (list.map((v) => v.id).includes(id)) {
            return options.fn(this);
          }
          return options.inverse(this);
        },
        ifEq: function (a, b, options) {
          if (a === b) {
            return options.fn(this);
          }
          return options.inverse(this);
        },
      },
    })
  );
  app.set("view engine", "handlebars");
  // This middleware makes it possible to parse form-data requests
  app.use(bodyParser.urlencoded({ extended: true }));

  // Creates a session middleware. We use session to persist
  //  which user is logged in in req.session.id
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    })
  );

  // Logger middleware
  app.use(morgan("common"));

  // Serves public files
  app.use(express.static("public"));

  app.get("/", function (req, res) {
    const ctx = context.NewContext(req);
    res.render("home", ctx);
  });

  app.get("/login", middlewares.EnsureNotLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    res.render("login", ctx);
  });

  app.post("/login", middlewares.EnsureNotLoggedIn, function (req, res) {
    const { username, password } = req.body;

    const user = userService.login(username, password);
    if (!user) {
      res.render("login", {
        error: "Invalid username/password",
      });
      return;
    }

    req.session.userId = user.id;
    res.redirect("/");
  });

  app.post("/logout", middlewares.EnsureLoggedIn, function (req, res) {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  });

  app.get("/characters", middlewares.EnsureLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    const characters = characterService.getUsersGroup(ctx.userId);
    res.render("character-list", {
      ...ctx,
      characters,
    });
  });

  app.use(middlewares.CatchAllError);

  app.listen(port, () => {
    console.log(`build_guild listening at http://localhost:${port}`);
  });
}

main();