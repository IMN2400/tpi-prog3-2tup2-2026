import express from "express";
import morgan from "morgan";
import { sequelize } from "./config/database.js";
import "./models/Person.js";
import personRoutes from "./routes/person.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(personRoutes);

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