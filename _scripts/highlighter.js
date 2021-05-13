const { renderCodeToHTML, runTwoSlash } = require("shiki-twoslash");

module.exports = async function markdownItShikiTwoslash(markdownit, highlighter) {
    const oldFence = markdownit.renderer.rules.fence;
    if (!oldFence) throw new Error("No fence set");
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

    markdownit.options.highlight = function (text, _lang) {
        const hasTwoslash = _lang.includes("-twoslash")
        let lang = _lang.replace("-twoslash", "")
        let code = text
        let twoslash = undefined;
        if (hasTwoslash) {
            twoslash = runTwoSlash(text, lang)
            code = twoslash.code
            lang = twoslash.extension
        }
        const html = renderCodeToHTML(code, lang, hasTwoslash ? ["twoslash"] : [], {}, highlighter, twoslash)
        return html.replace('background-color: #fff', 'background-color: #1E1E1E');
    };
}