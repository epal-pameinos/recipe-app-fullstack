const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

router.post("/createPost", upload.single("file"), postsController.createPost);
router.get("/:id", ensureAuth, postsController.getPost);
router.put("/likePost/:id", postsController.likePost);
router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
