import { Person } from "./Person.js";
import { Forum } from "./Forum.js";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import { PostLike } from "./PostLike.js";

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

// Relaciones Person - PostLike
Person.hasMany(PostLike, {
  foreignKey: "userId",
});

PostLike.belongsTo(Person, {
  foreignKey: "userId",
});

// Relaciones Post - PostLike
Post.hasMany(PostLike, {
  foreignKey: "postId",
});

PostLike.belongsTo(Post, {
  foreignKey: "postId",
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

const models = {
  Person,
  Forum,
  Post,
  Comment,
  PostLike,
};

export { Person, Forum, Post, Comment, PostLike};
export default models;