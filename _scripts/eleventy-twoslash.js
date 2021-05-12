const { createShikiHighlighter, renderCodeToHTML, runTwoSlash } = require("shiki-twoslash");

async function markdownItShikiTwoslash(markdownit, userOptions) {
  let highlighter = await createShikiHighlighter(userOptions);
  console.log(highlighter)

  const oldFence = markdownit.renderer.rules.fence;
  if (!oldFence) throw new Error("No fence set");

  // The highlighter API doesn't get the info in the codeblocks,
  // so we extract twoslash references and drop it into the language
  // which means it can be picked up below
  markdownit.renderer.rules.fence = (...args) => {
    const tokens = args[0];
    const idx = args[1];
    const token = tokens[idx];
    if (token.info && token.info.includes("twoslash")) {
      const before = token.info.split(/\s+/g)[0];
      token.info = before + "-twoslash";
    }
    const theirs = oldFence(...args);
    return theirs;
  };

  // Look for a twoslash result in the language, and use that to run the sample
  markdownit.options.highlight = function (text, _lang) {
    const hasTwoslash = _lang.includes("-twoslash")
    let lang = _lang.replace("-twoslash", "")
    let code = text

    let twoslashResults;

    if (hasTwoslash) {
      twoslashResults = runTwoSlash(text, lang)
      code = twoslashResults.code
      lang = twoslashResults.extension
    }

    const results = renderCodeToHTML(code, lang, highlighter, twoslashResults)
    return results
  };
}

module.exports = markdownItShikiTwoslash;