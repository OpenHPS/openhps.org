// Gets the position of an element relative to the whole page
var getAbsoluteElementPos = function (element) {
    var bodyRect = document.body.getBoundingClientRect();
    var elemRect = element.getBoundingClientRect();
    var top = elemRect.top - bodyRect.top;
    var left = elemRect.left - bodyRect.left;
    return {
        top: top,
        left: left
    };
};
// Hide it
var resetHover = function () {
    var globalPopover = document.getElementById("twoslash-mouse-hover-info");
    if (globalPopover)
        globalPopover.style.display = "none";
};
// Get it
var findOrCreateTooltip = function () {
    var globalPopover = document.getElementById("twoslash-mouse-hover-info");
    if (!globalPopover) {
        globalPopover = document.createElement("div");
        globalPopover.style.position = "absolute";
        globalPopover.id = "twoslash-mouse-hover-info";
        document.body.appendChild(globalPopover);
    }
    return globalPopover;
};
var getRootRect = function (element) {
    if (element.nodeName.toLowerCase() === "pre") {
        return element.getBoundingClientRect();
    }
    return getRootRect(element.parentElement);
};
// Gets triggered on the spans inside the codeblocks
var hover = function (event) {
    var hovered = event.target;
    if (hovered.nodeName !== "DATA-LSP")
        return resetHover();
    var message = hovered.getAttribute("lsp");
    var position = getAbsoluteElementPos(hovered);
    // Create or re-use the current hover div
    var tooltip = findOrCreateTooltip();
    // Use a textarea to un-htmlencode for presenting to the user
    var txt = document.createElement("textarea");
    txt.innerHTML = message;
    tooltip.textContent = txt.value;
    // Offset it a bit from the mouse and present it at an absolute position
    var yOffset = 20;
    tooltip.style.display = "block";
    tooltip.style.top = position.top + yOffset + "px";
    tooltip.style.left = position.left + "px";
    // limit the width of the tooltip to the outer container (pre)
    var rootRect = getRootRect(hovered);
    var relativeLeft = position.left - rootRect.x;
    tooltip.style.maxWidth = rootRect.width - relativeLeft + "px";
};
/**
 * Creates the main mouse over popup for LSP info using the DOM API.
 * It is expected to be run inside a `useEffect` block inside your main
 * exported component in Gatsby.
 *
 * @example
 * import React, { useEffect } from "react"
 * import { setupTwoslashHovers } from "shiki-twoslash/dom";
 *
 * export default () => {
 *   // Add a the hovers
 *   useEffect(setupTwoslashHovers)
 *
 *   // Normal JSX
 *   return </>
 * }
 *
 */
var setupTwoslashHovers = function () {
    var blocks = document.querySelectorAll(".shiki.lsp .code-container code");
    blocks.forEach(function (code) {
        code.addEventListener("mouseover", hover);
        code.addEventListener("mouseout", resetHover);
    });
    return function () {
        blocks.forEach(function (code) {
            code.removeEventListener("mouseover", hover);
            code.removeEventListener("mouseout", resetHover);
        });
    };
};
setupTwoslashHovers();