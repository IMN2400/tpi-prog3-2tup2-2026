import { Person } from "./Person.js";
import { Forum } from "./Forum.js";

// Relaciones
Person.hasMany(Forum, {
  foreignKey: "fundadorId",
});

Forum.belongsTo(Person, {
  foreignKey: "fundadorId",
});

export { Person, Forum };