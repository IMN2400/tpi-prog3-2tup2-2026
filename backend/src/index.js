import express from "express";
import morgan from "morgan";
import { sequelize } from "./config/database.js";
import personRoutes from "./routes/person.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import banRoutes from "./routes/ban.routes.js"
import commentRoutes from "./routes/comment.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(personRoutes);
app.use(forumRoutes);
app.use(authRoutes);
app.use(banRoutes);
app.use(commentRoutes);
app.use(postRoutes);

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    console.log("Base de datos conectada y sincronizada");

    app.listen(3000, () => {
      console.log("Servidor en puerto 3000");
    });
  } catch (error) {
    console.log(error);
  }
}

main();