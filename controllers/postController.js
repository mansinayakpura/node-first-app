const Posts = require("../models/postsModel");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Posts.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

exports.getSinglePost = async function (req, res, next) {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

exports.addPost = async (req, res, next) => {
  const { title, description } = req.body;
  // const { userId } = req.user;
  try {
    const savedPost = await Posts.create({
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({ success: true, data: savedPost });
  } catch (error) {
    next(error);
  }
};

exports.editPost = async function (req, res, next) {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedPost = await Posts.findByIdAndUpdate(
      id,
      { title, description, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Posts.findByIdAndDelete(req.params.id);
    if (!deletedPost)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
