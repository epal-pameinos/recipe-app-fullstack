const Post = require("../models/Post");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getProfilePage: async (request, response) => {
    try {
      const posts = await Post.find({ user: request.user.id });
      response.render("profile.ejs", { posts: posts, user: request.user });
    } catch (error) {
      console.log(error);
    }
  },
  getFeedPage: async (request, response) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("user");
      response.render("feed.ejs", { posts: posts });
    } catch (error) {
      console.log(error);
    }
  },
  createPost: async (request, response) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(request.file.path);

      await Post.create({
        title: request.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: request.body.caption,
        likes: 0,
        user: request.user.id,
      });
      console.log("Post has been added!");
      response.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  },
  getPost: async (request, response) => {
    try {
      const post = await Post.findById(request.params.id);
      response.render("post.ejs", { post: post, user: request.user });
    } catch (error) {
      console.log(error);
    }
  },
  likePost: async (request, response) => {
    try {
      await Post.findOneAndUpdate(
        { _id: request.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      response.redirect(`/post/${request.params.id}`);
    } catch (error) {
      console.log(error);
    }
  },
  deletePost: async (request, response) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: request.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.findByIdAndDelete(request.params.id);
      console.log("Deleted Post");
      response.redirect("/profile");
    } catch (error) {
      console.log("Test that Delete Post did not work....");
      response.redirect("/profile");
    }
  },
};
