const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItVideo = require("markdown-it-video");
const markdownItLatex = require("markdown-it-latex").default;
const shikiTwoslash = require("eleventy-plugin-shiki-twoslash");
const { html5Media } = require('markdown-it-html5-media');
const pluginTOC = require('eleventy-plugin-toc');
const pluginSEO = require("eleventy-plugin-seo");
const pluginSASS = require("eleventy-sass");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const pluginValidator = require('eleventy-plugin-html-validate');
const pluginRss = require("@11ty/eleventy-plugin-rss");

const { DateTime } = require("luxon");
const fs = require('fs');
const nunjucks = require("nunjucks");
const markdown = require('nunjucks-markdown');
const markdownItAttrs = require('markdown-it-attrs');
const pluginPDFEmbed = require('eleventy-plugin-pdfembed');
const faviconPlugin = require("./_scripts/favicon");
require('dotenv').config();
const { decktape } = require("./_scripts/decktape");
const { qr } = require("./_scripts/qr");
const _ = require("lodash");

module.exports = function (el) {
  /* Passthrough Copy */
  el.addPassthroughCopy("scripts");
  el.addPassthroughCopy("fonts");
  el.addPassthroughCopy("CNAME");
  el.addPassthroughCopy("_redirects");
  el.addPassthroughCopy({
    "node_modules/reveal.js/dist/reveal.css": "vendor/reveal.js/reveal.css",
    "node_modules/reveal.js/dist/reset.css": "vendor/reveal.js/reset.css",
    "node_modules/reveal.js/dist/reveal.esm.js": "vendor/reveal.js/reveal.esm.js",
    "node_modules/reveal.js/plugin/notes/notes.esm.js": "vendor/reveal.js/plugin/notes/notes.esm.js",
    "node_modules/reveal.js-pointer/dist/pointer.esm.js": "vendor/reveal.js/plugin/pointer/pointer.esm.js",
    "node_modules/reveal.js-pointer/dist/pointer.css": "vendor/reveal.js/plugin/pointer/pointer.css",
  });

  el.setDataDeepMerge(true);

  /* SEO */
  el.addPlugin(pluginSEO, require("./_data/seo.json"));
  el.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://openhps.org",
    },
  });
  el.addPlugin(faviconPlugin);
  el.addPlugin(pluginRss);
  //el.addPlugin(pluginValidator);

  /* PDF Embedding */
  el.addPlugin(pluginPDFEmbed, {
    key: 'd53c00f0cb1a4ff7970bfcacf82145aa'
	});

  /* Markdown */
  const md = markdownIt({ html: true });
  md.use(markdownItAnchor);
  md.use(markdownItLatex);
  md.use(markdownItAttrs, {
    leftDelimiter: '{$',
    rightDelimiter: '$}',
    allowedAttributes: []
  });
  el.addPlugin(shikiTwoslash, { 
    theme: "dark-plus",
    defaultCompilerOptions: {
      strict: false
    }
  });
  const highlighter = el.markdownHighlighter;
  el.markdownHighlighter = (code, lang, fence) => {
    const result = highlighter(code, lang, fence);
    return result === "" ? "<pre style='display: none'></pre>" : result;
  };
  md.use(markdownItVideo, {
    youtube: { width: 640, height: 390 },
    vimeo: { width: 500, height: 281 },
    vine: { width: 600, height: 600, embed: 'simple' },
    prezi: { width: 550, height: 400 }
  });
  md.use(html5Media);
  el.setLibrary("md", md);
  el.addPlugin(pluginTOC, {
    tags: ['h2'],
    ul: true
  });

  /* Stylesheets */
  el.addPlugin(pluginSASS, [
    {
      compileOptions: {
        permalink: function(permalinkString, inputPath) {
          return (data) => {
            return data.page.filePathStem.replace(/^\/_scss\//, "/css/") + ".css";
          };
        }
      },
      sass: {
        style: "expanded",
        sourceMap: true
      }
    }, {
      rev: true,
      when: { ELEVENTY_ENV: "stage" }
    }, {
      sass: {
        style: "compressed",
        sourceMap: false
      },
      rev: true,
      when: [ { ELEVENTY_ENV: "production" }, { ELEVENTY_ENV: false } ]
    }
  ]);

  /* Nunjucks */
  let njkEnv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader("_includes")
  );
  markdown.register(njkEnv, (src, _) => {
    return md.render(src);
  });
  el.setLibrary("njk", njkEnv);

  /* Collections */
  el.addCollection("sorted_docs", (collection) => {
    const items = collection.getFilteredByTag("docs");
    items.sort((a, b) => a.data.menuOrder - b.data.menuOrder);
    return items;
  });
  el.addCollection("posts_year", (collection) => {
    return _.chain(collection.getFilteredByTag("posts").sort((a, b) => a.date - b.date))
      .groupBy((post) => post.date.getFullYear())
      .toPairs()
      .reverse()
      .value();
  });
  el.addCollection("publications_year", (collection) => {
    return _.chain(collection.getFilteredByTag("publications").sort((a, b) => a.date - b.date))
      .groupBy((post) => post.date.getFullYear())
      .toPairs()
      .reverse()
      .value();
  });

  el.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("cccc, dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  el.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  el.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  el.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  el.setBrowserSyncConfig({
    callbacks: {
      ready: function(_, browserSync) {
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

  el.addPlugin(decktape);

  el.addPlugin(qr);

  return {
    templateFormats: [
      "ico",
      "njk",
      "jpg",
      "md",
      "html",
      "liquid",
      "svg",
      "png",
      "pdf",
      'gif',
      "mp4",
      "webm",
      "webp"
    ],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      layouts: "_layouts",
    },
  };
};
