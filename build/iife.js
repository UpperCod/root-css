var rootCss = (function (preact) {
    'use strict';

    function blocks(style, tagInit, tagEnd) {
        var open = 0,
            cut = 0,
            parent = "",
            current = [];
        for (var index = 0; index < style.length; index++) {
            if (style[index] === tagInit) {
                if (!open++) {
                    cut = index + 1;
                }
                continue;
            }
            if (style[index] === tagEnd) {
                if (!--open) {
                    current = current.concat({
                        parent: parent,
                        content: style.slice(cut, index)
                    });
                    parent = "";
                }
                continue;
            }
            if (!open) { parent += style[index]; }
        }
        return current;
    }

    function join() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return args.join("");
    }

    function clearSpace(selector) {
        return selector.replace(/([\n\s\t]+)/g, " ").replace(/^\s+|\s+$/g, "");
    }

    var Sheet = function Sheet(style, root, prefix, tag) {
        this.root = root;
        this.blocks = blocks(style, "{", "}");
        this.rules = [];
        this.prefix = prefix;
        this.tag = tag;
    };
    Sheet.prototype.insert = function insert (rule) {
        if (this.rules.indexOf(rule) < 0) {
            // getGlobalTag().appendChild(document.createTextNode(rule));
            try {
                var sheet = this.tag.sheet;
                sheet.insertRule(rule, sheet.rules.length);
                this.rules.push(rule);
            } catch (e) {
                throw rule;
            }
        }
    };
    Sheet.prototype.replaceRoot = function replaceRoot (rule) {
            var this$1 = this;

        return rule.replace(
            /\:root(Name){0,1}(?:\[([^\]]+)\]){0,}/g,
            function (context, name, expression) {
                var root = join(name ? "" : ".", this$1.root);
                if (expression) {
                    root = join(root, "[", this$1.prefix, expression, "]");
                }
                return root;
            }
        );
    };
    Sheet.prototype.replaceGlobal = function replaceGlobal (parent) {
        return parent.replace(/:global /g, "");
    };
    Sheet.prototype.replace = function replace (parent, content) {
        parent = parent
            .match(/([^\,]+)/g)
            .map(function (selector) {
                selector = clearSpace(selector);
                return /^(:global|:root)/.test(selector)
                    ? selector
                    : join(":root ", selector);
            })
            .join(", ");

        var rule = join(parent, "{", content, "}");
        rule = this.replaceRoot(rule);
        rule = this.replaceGlobal(rule);
        return rule;
    };
    Sheet.prototype.load = function load () {
            var this$1 = this;

        if (this.isLoad) { return; }
        this.blocks.forEach(function (ref) {
                var parent = ref.parent;
                var content = ref.content;

            parent = clearSpace(parent);
            var type = parent.match(/\@[^\s\t\n\(]+/g);
            if (type) {
                switch (type[0]) {
                    case "@media":
                        content = blocks(content, "{", "}")
                            .map(function (ref) {
                                        var parent = ref.parent;
                                        var content = ref.content;

                                        return this$1.replace(clearSpace(parent), content);
                    }
                            )
                            .join("\n");
                        this$1.insert(join(parent, "{", content, "}"));
                        break;
                    case "@keyframes":
                        this$1.insert(
                            join(this$1.replaceRoot(parent), "{", content, "}")
                        );
                        break;
                    default:
                        this$1.insert(join(parent, "{", content, "}"));
                }
            } else {
                this$1.insert(this$1.replace(parent, content));
            }
        });
        this.isLoad = true;
    };

    var config = {
        prefix: "data-state-",
        tag: false,
        ids: []
    };

    function createId(prefix, size) {
        if ( prefix === void 0 ) prefix = "";
        if ( size === void 0 ) size = 5;

        var range =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            id = prefix;
        while (size) {
            --size;
            id += range.charAt(Math.floor(Math.random() * range.length));
        }
        if (config.ids.indexOf(id) > -1) {
            return createId(prefix, size + 1);
        } else {
            config.ids = config.ids.concat(id);
            return id;
        }
    }

    function createTag() {
        if (config.tag) { return config.tag; }
        config.tag = document.createElement("style");
        config.tag.dataset.componentsStyles = "";
        document.head.appendChild(config.tag);
        return config.tag;
    }

    var Theme = (function (Component) {
        function Theme () {
            Component.apply(this, arguments);
        }

        if ( Component ) Theme.__proto__ = Component;
        Theme.prototype = Object.create( Component && Component.prototype );
        Theme.prototype.constructor = Theme;

        Theme.prototype.setProps = function setProps (props, data) {
            if ( data === void 0 ) data = {};

            for (var prop in props) {
                if (!/^(children|_style|_tag|_prefix|_load|_root)$/.test(prop)) {
                    data[/^on/.test(prop) ? prop : join(props._prefix, prop)] =
                        props[prop];
                }
            }
            return data;
        };
        Theme.prototype.render = function render () {
            var props = this.props;
            props._load();
            return preact.h(
                props._tag || "div",
                this.setProps(props, {
                    class: props._root,
                    children: props.children
                })
            );
        };

        return Theme;
    }(preact.Component));

    function create(tag) {
        if ( tag === void 0 ) tag = "div";

        return function (style) {
            style = new Sheet(style, createId("S"), config.prefix, createTag());
            return function (props) { return (
                preact.h( Theme, Object.assign({},
                    props, { _root: style.root, _tag: tag, _prefix: config.prefix, _load: function () { return style.load(); } }))
            ); };
        };
    }

    var index = create;

    return index;

}(preact));
