const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");

const Article = require("../../models/Article");
// const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route  GET api/articles/me
// @desc   Get all of the logged in users articles
//@access  Private
router.get("/me", auth, async (req, res) => {

  try {
    const article = await Article.find({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!article) {
      return res.status(400).json({ msg: "There is no article for this user" });
    }


    res.json(article);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/articles
// @desc     Create an article
// @access   Private
router.post(
    "/",
    auth,
    body("title", "Please write your article").notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select("-password");

        const documents = req.body.documents || [];
  
        const newArticle = new Article({
          title: req.body.title,
          abstract: req.body.abstract,
          content: req.body.content,
          citations: req.body.citations,
          documents: documents,
          author: user.name,
          avatar: user.avatar,
          user: req.user.id,
        });
  
        const article = await newArticle.save();
  
        res.json(article);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
  );

// @route    PUT api/articles/:id
// @desc     Update an existing article
// @access   Private
router.put(
  "/:id",
  auth,
  body("title", "Please add a title to your article").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the article exists
      let article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ msg: "Article not found" });
      }

      // Ensure that only the author can update the article
      if (article.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

        // Update only the fields that are provided in the request body
        const { title, abstract, content, citations, documents } = req.body;
        if (title) article.title = title;
        if (abstract) article.abstract = abstract;
        if (content) article.content = content;
        if (citations) article.citations = citations;
        if (documents) article.documents = documents;

      // Save the updated article
      article = await article.save();

      res.json(article);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    GET api/article
// @desc     Get all articles from all users
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    
    const articles = await Article.find().sort({ date: -1 }); // -1 is most recent date first
    const count = articles.length
    
    res.json({ count, articles });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/articles/:userId/user-articles
// @desc     Get articles created by a specific user
// @access   Public
router.get("/:user_id/user-articles", auth, async (req, res) => {
  try {
    const articles = await Article.find({ user: req.params.user_id });
    const count = articles.length
    if (!articles) {
      return res.status(404).json({ message: "No articles found" });
    }
    res.json({ articles, count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/article/:id
// @desc     Get article by Id
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error(error.message);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Article not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/articles/:id
// @desc     Delete article by article :_id
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    console.log(article); // add this line to log the post variable

    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    // Check if logged in user matches user of the post
    if (article.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await article.deleteOne();

    res.json({ msg: "Article removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Article not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/article/like/:id
// @desc     Like an article
// @access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    // Check if this article already been liked by this user
    if (
      article.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Article already liked" });
    }

    article.likes.unshift({ user: req.user.id });

    await article.save();

    res.json(article.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/articles/unlike/:id
// @desc     unLike an article
// @access   Private
router.put("/unlike/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    // Check if this article has already been liked by this user
    if (
      article.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "You cant unlike something you haven't liked yet" });
    }

    // Get remove index
    const removeIndex = article.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    article.likes.splice(removeIndex, 1);

    await article.save();

    res.json(article.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/article/comment/:id
// @desc     Create a comment for an article
// @access   Private
router.post(
  "/comment/:id",
  auth,
  checkObjectId("id"),
  body("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const article = await Article.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      article.comments.unshift(newComment);

      await article.save();

      res.json(article.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/article/comment/:id/:comment_id
// @desc     Delete a comment on an article.
// @desc     Delete by post id then comment id.
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    // Identify the post for the comment
    const article = await Article.findById(req.params.id);

    // Fetch comment for post
    const comment = article.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Get remove index
    const removeIndex = article.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    article.comments.splice(removeIndex, 1);

    await article.save();

    res.json(article.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;