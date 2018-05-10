import { join, blocks, clearSpace } from "./utils";

/**
 * @method load - insert the style given by the component once the component requires it
 */
export default class Sheet {
    /**
     *
     * @param {string} style - css style to encapsulate using the root class
     * @param {string} root - className to encapsulate the style
     * @param {string} prefix - is added to the attributes selector of: root
     * @param {element} tag - the style element to which to insert the styles
     */
    constructor(style, root, prefix, tag) {
        this.root = root;
        this.blocks = blocks(style, "{", "}");
        this.rules = [];
        this.prefix = prefix;
        this.tag = tag;
    }
    /**
     * insert the style to the dom
     * @param {string} rule - Traditional CSS style rules
     */
    insert(rule) {
        if (this.rules.indexOf(rule) < 0) {
            // getGlobalTag().appendChild(document.createTextNode(rule));
            try {
                let sheet = this.tag.sheet;
                sheet.insertRule(rule, sheet.rules.length);
                this.rules.push(rule);
            } catch (e) {
                throw rule;
            }
        }
    }
    /**
     * replaces the given string with the pattern :root
     * @param {string} rule
     * @returns {string}
     */
    replaceRoot(rule) {
        return rule.replace(
            /\:root(Name){0,1}(?:\[([^\]]+)\]){0,}/g,
            (context, name, expression) => {
                let root = join(name ? "" : ".", this.root);
                if (expression) {
                    root = join(root, "[", this.prefix, expression, "]");
                }
                return root;
            }
        );
    }
    /**
     * replaces the given string with the pattern :global
     * @param {string} rule
     * @returns {string}
     */
    replaceGlobal(parent) {
        return parent.replace(/:global /g, "");
    }
    /**
     * returns the style with all the planned changes
     * @param {string} parent - selector css
     * @param {string} content - style properties
     * @param {string} - CSS rule
     */
    replace(parent, content) {
        parent = parent
            .match(/([^\,]+)/g)
            .map(selector => {
                selector = clearSpace(selector);
                return /^(:global|:root)/.test(selector)
                    ? selector
                    : join(":root ", selector);
            })
            .join(", ");

        let rule = join(parent, "{", content, "}");
        rule = this.replaceRoot(rule);
        rule = this.replaceGlobal(rule);
        return rule;
    }
    load() {
        if (this.isLoad) return;
        this.blocks.forEach(({ parent, content }) => {
            parent = clearSpace(parent);
            let type = parent.match(/\@[^\s\t\n\(]+/g);
            if (type) {
                switch (type[0]) {
                    case "@media":
                        content = blocks(content, "{", "}")
                            .map(({ parent, content }) =>
                                this.replace(clearSpace(parent), content)
                            )
                            .join("\n");
                        this.insert(join(parent, "{", content, "}"));
                        break;
                    case "@keyframes":
                        this.insert(
                            join(this.replaceRoot(parent), "{", content, "}")
                        );
                        break;
                    default:
                        this.insert(join(parent, "{", content, "}"));
                }
            } else {
                this.insert(this.replace(parent, content));
            }
        });
        this.isLoad = true;
    }
}
