```js
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const connectToDB = async () => {
try {
await mongoose.connect("mongodb://localhost:27017/socialMedia", {
useNewUrlParser: true,
useUnifiedTopology: true,
});
console.log("Connected to DB");
} catch (err) {
console.log(err);
}
};

connectToDB();

const userSchema = new mongoose.Schema(
{
// _id: mongoose.Schema.Types.ObjectId,
name: {
type: String,
required: true,
},
email: {
type: String,
required: true,
},
password: {
type: String,
required: true,
},
role: {
type: String,
enum: ["admin", "user"],
default: "user",
},
},
{ timestamps: true }
);

const postSchema = new mongoose.Schema(
{
noOfStars: {
type: Number,
default: 0,
},
title: {
type: String,
required: true,
},
content: {
type: String,
required: true,
},
noOfLikes: {
type: Number, // like: increment by 1, dislike: decrement by 1
default: 0,
},
comments: [
// Array of comments : [98765456, 98765456, 98765456]
{
type: mongoose.Schema.Types.ObjectId,
ref: "Comment",
},
],
ownerId: {
type: mongoose.Schema.Types.ObjectId, //1234567654323456
ref: "User",
},
},
{
timestamps: true,
}
);

const commentSchema = new mongoose.Schema(
{
content: {
type: String,
required: true,
},
commentorId: {
type: mongoose.Schema.Types.ObjectId, // the commentor must be a user and signed in
ref: "User",
},
post: {
type: mongoose.Schema.Types.ObjectId,
ref: "Post",
},
},
{
timestamps: true,
}
);

// modles
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);

// seed data
const seedData = async () => {
try {
const users = [
{
name: "user1",
email: "ab@gmail.com",
password: "123456",
role: "user",
},
{
name: "admin1",
email: "admin@gmail.com",
password: "123456",
role: "admin",
},
{
name: "ridan",
email: "ridwan@gmail.com",
password: "123456",
role: "user",
},
];

const posts = [
{
title: "post1",
content: "content1",
ownerId: "6687bc3676aeca250115532a",
},
{
title: "post2",
content: "content1",
ownerId: "6687bc3676aeca250115532a",
},
{
title: "post3",
content: "content1",
ownerId: "6687bc3676aeca250115532b",
},
{
title: "post4",
content: "ridwan post",
ownerId: "6687bc3676aeca250115532c",
},
];

// const comments = [
// {
// content: "comment1",
// commentorId: "60f6e7e4c3c3e5e7a4e9b5b2",
// post: "60f6e7e4c3c3e5e7a4e9b5b2",
// },
// ];

// await User.insertMany(users);
await Post.insertMany(posts);
// await Comment.insertMany(comments);
console.log("Data Seeded");
} catch (err) {
console.log(err);
}
};

// seedData();

// get all users
const getAllUsers = async () => {
try {
const users = await User.find();
console.log(users);
} catch (err) {
console.log(err);
}
};

// getAllUsers();

// view all comments of a post
const viewAllComments = async (postId) => {
try {
const post = await Post.findById(postId).populate("comments");
console.log(post.comments);
} catch (err) {
console.log(err);
}
};

// get all posts
const getAllPosts = async () => {
try {
const posts = await Post.find();
console.log(posts);
} catch (err) {
console.log(err);
}
};

// getAllPosts();

//view all post belonging to a user
const viewAllPost = async (userId) => {
try {
const posts = await Post.find({ ownerId: userId });
console.log(posts);
} catch (err) {
console.log(err);
}
};

// like a post
const likePost = async (postId) => {
try {
const post = await Post.findById(postId);
// post.noOfLikes = post.noOfLikes + 1;
post.noOfLikes += 1;
await post.save();
console.log(post);
} catch (err) {
console.log(err);
}
};

const unLikePost = async (postId) => {
try {
const post = await Post.findById(postId);
// post.noOfLikes = post.noOfLikes + 1;
if (post.noOfLikes === 0) {
console.log("No like to unlike for this post");
return 0;
}
post.noOfLikes -= 1;
await post.save();
console.log(post);
} catch (err) {
console.log(err);
}
};

// likePost("6687bcb72cc0a4935a57ce7e");
unLikePost("6687bcb72cc0a4935a57ce7e");
// viewAllPost("6687bc3676aeca250115532a");

app.get("/", (req, res) => {
res.send("Hello W😊😊😊😊😊😊😊😊😊😊😊orld");
});

app.listen(PORT, () => {
console.log(`Sermmmver is running on port ${PORT}`);
});
```
