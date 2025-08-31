const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

router.get("/", homeController.getIndex);
router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLogin);
router.get("/signup", authController.getSignupPage);
router.post("/signup", authController.postSignup);
router.get("/logout", authController.logout);

router.get("/profile", ensureAuth, postsController.getProfilePage);
router.get("/feed", ensureAuth, postsController.getFeedPage);

module.exports = router;
