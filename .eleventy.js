const markdownIt = require("markdown-it");
const shiki = require('markdown-it-shiki').default;
const markdownItAnchor = require("markdown-it-anchor");
const pluginSass = require("eleventy-plugin-sass");
const { DateTime } = require("luxon");
const fs = require('fs');

const downloadDocs = require("./_scripts/api");

module.exports = function (el) {
  el.addPassthroughCopy("images");
  el.addPassthroughCopy("media");
  el.addPassthroughCopy("papers");
  el.addPassthroughCopy("scripts");

  el.setDataDeepMerge(true);

  el.addPlugin(pluginSass, {
    watch: ["_scss/**/*.{scss,sass}"],
    outputDir: "_site/css"
  });

  /* Markdown */
  const md = markdownIt({ html: true });
  md.use(markdownItAnchor);
  md.use(shiki, { theme: 'dark-plus' });
  el.setLibrary("md", md);

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
      "md",
      "html",
      "liquid"
    ],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      layouts: "_layouts",
    },
  };
};
