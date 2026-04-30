const posts = require("../data/blogPosts");
const { getBaseURL } = require("../utils/baseUrl");

async function getBlogIndex(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // 9 posts per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const publishedPosts = posts.filter(post => post.published);
    publishedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const currentPosts = publishedPosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(publishedPosts.length / limit);

    return res.render("blog/index", {
      posts: currentPosts,
      currentPage: page,
      totalPages: totalPages,
      baseURL: getBaseURL(req),
      user: req.user || null,
      metaTitle: "Nickly Blog - URL Shortening, Analytics & Marketing Tips",
      metaDescription: "Read the latest articles on link management, url shortening best practices, analytics, and marketing.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

async function getBlogPost(req, res) {
  try {
    const slug = req.params.slug;
    const post = posts.find((p) => p.slug === slug && p.published);

    if (!post) {
      return res.status(404).render("404", {
        baseURL: getBaseURL(req),
        user: req.user || null,
        message: "Blog post not found",
      });
    }

    // Get 3 recent posts for the "Read More" section
    const recentPosts = posts
      .filter((p) => p.published && p.slug !== slug)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    return res.render("blog/post", {
      post,
      recentPosts,
      baseURL: getBaseURL(req),
      user: req.user || null,
      metaTitle: `${post.title} - Nickly Blog`,
      metaDescription: post.excerpt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

module.exports = {
  getBlogIndex,
  getBlogPost,
};
