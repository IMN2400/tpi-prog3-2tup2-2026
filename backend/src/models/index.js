import { Person } from "./Person.js";
import { Forum } from "./Forum.js";

// import { sequelize } from "../db.js";
// import { DataTypes } from "sequelize";
// import { PostModel } from "./Post.js";
// import { CommentModel } from "./Comment.js";
// import { UserModel } from "./User.js";

// const Post = PostModel(sequelize, DataTypes);
// const Comment = CommentModel(sequelize, DataTypes);
// const User = UserModel(sequelize, DataTypes);

// User.hasMany(Post, {
//   foreignKey: "userId",
// });

// Post.belongsTo(User, {
//   foreignKey: "userId",
// });

// Post.hasMany(Comment, {
//   foreignKey: "postId",
// });

// Comment.belongsTo(Post, {
//   foreignKey: "postId",
// });

// User.hasMany(Comment, {
//   foreignKey: "userId",
// });

// Comment.belongsTo(User, {
//   foreignKey: "userId",
// });

// const models = {
//   User,
//   Post,
//   Comment,
// };

// export default models;

// Relaciones activas del backend actual
Person.hasMany(Forum, {
  foreignKey: "fundadorId",
});

Forum.belongsTo(Person, {
  foreignKey: "fundadorId",
});

export { Person, Forum };