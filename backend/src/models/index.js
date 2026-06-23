import { Person } from "./Person.js";
import { Forum } from "./Forum.js";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import BanModel from "./Bans.js";

// Relaciones Person - Forum
Person.hasMany(Forum, {
  foreignKey: "fundadorId",
});

Forum.belongsTo(Person, {
  foreignKey: "fundadorId",
});

// Relaciones Person - Post
Person.hasMany(Post, {
  foreignKey: "userId",
});

Post.belongsTo(Person, {
  foreignKey: "userId",
});

// Relaciones Post - Comment
Post.hasMany(Comment, {
  foreignKey: "postId",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
});

// Relaciones Person - Comment
Person.hasMany(Comment, {
  foreignKey: "userId",
});

Comment.belongsTo(Person, {
  foreignKey: "userId",
});

Forum.hasMany(Post, {
  foreignKey: "forumId",
});

Post.belongsTo(Forum, {
  foreignKey: "forumId",
});

Person.hasMany(BanModel, {
  foreignKey: "userId",
  as: "bansRecibidos",
});

BanModel.belongsTo(Person, {
  foreignKey: "userId",
  as: "bannedUser",
});

Person.hasMany(BanModel, {
  foreignKey: "adminId",
  as: "bansCreados",
});

BanModel.belongsTo(Person, {
  foreignKey: "adminId",
  as: "adminUser",
});

const models = {
  Person,
  Forum,
  Post,
  Comment,
  BanModel,
};

export { Person, Forum, Post, Comment, BanModel};
export default models;