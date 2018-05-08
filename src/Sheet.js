import { join, blocks, clearSpace } from "./utils";

export default class Sheet {
    constructor(style, root, prefix, tag) {
        this.root = root;
        this.blocks = blocks(style, "{", "}");
        this.rules = [];
        this.prefix = prefix;
        this.tag = tag;
    }
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
    replaceGlobal(parent) {
        return parent.replace(/:global /g, "");
    }
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
