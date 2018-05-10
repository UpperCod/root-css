/**
 * to separate the CSS style in an arrangement into rule blocks, by selector (parent) and its properties (content)
 * @param {string} style - CSS style
 * @param {string} tagInit - initial tag to search to generate the block
 * @param {string} tagEnd - end tag to search to generate the block
 */
export function blocks(style, tagInit, tagEnd) {
    let open = 0,
        cut = 0,
        parent = "",
        current = [];
    for (let index = 0; index < style.length; index++) {
        if (style[index] === tagInit) {
            if (!open++) {
                cut = index + 1;
            }
            continue;
        }
        if (style[index] === tagEnd) {
            if (!--open) {
                current = current.concat({
                    parent, // selector
                    content: style.slice(cut, index) // properties css
                });
                parent = "";
            }
            continue;
        }
        if (!open) parent += style[index];
    }
    return current;
}

export function join(...args) {
    return args.join("");
}
/**
 *
 * @param {string} selector - allows to clean the spaces of a selector
 */
export function clearSpace(selector) {
    return selector.replace(/([\n\s\t]+)/g, " ").replace(/^\s+|\s+$/g, "");
}
