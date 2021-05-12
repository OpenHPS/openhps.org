const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItVideo = require("markdown-it-video");
const markdownItShikiTwoslash = require("./_scripts/eleventy-twoslash");
const { html5Media } = require('markdown-it-html5-media');
const pluginTOC = require('eleventy-plugin-toc');
const pluginSEO = require("eleventy-plugin-seo");
const pluginSASS = require("eleventy-plugin-sass");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const { DateTime } = require("luxon");
const fs = require('fs');

const downloadDocs = require("./_scripts/api");

module.exports = function (el) {
  el.addPassthroughCopy("images");
  el.addPassthroughCopy("scripts");
  el.addPassthroughCopy("media");
  el.addPassthroughCopy("slides");
  el.addPassthroughCopy("CNAME");
  el.addPassthroughCopy({
    "node_modules/reveal.js/dist/reveal.css": "vendor/reveal.js/reveal.css",
    "node_modules/reveal.js/dist/reset.css": "vendor/reveal.js/reset.css",
    "node_modules/reveal.js/dist/reveal.js": "vendor/reveal.js/reveal.js",
  });

  el.setDataDeepMerge(true);

  /* SEO */
  el.addPlugin(pluginSEO, require("./_data/seo.json"));
  el.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://openhps.org",
    },
  });

  /* Stylesheets */
  el.addPlugin(pluginSASS, {
    watch: ["_scss/**/*.{scss,sass}"],
    outputDir: "_site/css",
    cleanCSS: true
  });

  /* Markdown */
  const md = markdownIt({ html: true });
  md.use(markdownItAnchor);
  md.use(markdownItShikiTwoslash, { theme: 'dark-plus' });
  md.use(markdownItVideo, {
    youtube: { width: 640, height: 390 },
    vimeo: { width: 500, height: 281 },
    vine: { width: 600, height: 600, embed: 'simple' },
    prezi: { width: 550, height: 400 }
  });
  md.use(html5Media);
  el.setLibrary("md", md);
  el.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'div'
  });

  el.addCollection("sorted_docs", function (collection) {
    const items = collection.getFilteredByTag("docs");
    items.sort((a, b) => a.data.menuOrder - b.data.menuOrder);
    return items;
  });

  el.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  el.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  el.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  el.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  el.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  downloadDocs();

  return {
    templateFormats: [
      "ico",
      "png",
      "njk",
      "jpg",
      "md",
      "html",
      "liquid",
      "mp4"
    ],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      layouts: "_layouts",
    },
  };
};
