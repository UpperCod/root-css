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
                    parent,
                    content: style.slice(cut, index)
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

export function clearSpace(selector) {
    return selector.replace(/([\n\s\t]+)/g, " ").replace(/^\s+|\s+$/g, "");
}
