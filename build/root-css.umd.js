(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('preact')) :
    typeof define === 'function' && define.amd ? define(['exports', 'preact'], factory) :
    (factory((global.rootcss = {}),global.preact));
}(this, (function (exports,preact) { 'use strict';

    /**
     * get or create and insert in the document the style tag with the given id
     * @param {string} id  - id of the style tag
     * @return {HTMLStyleElement}
     */
    function createTagStyle(id) {
        if ( id === void 0 ) id = "styles-root-css";

        var style = document.getElementById(id);
        if (!style) {
            style = document.createElement("style");
            style.id = id;
            document.head.appendChild(style);
        }
        return style;
    }
    /**
     * create a random string
     * @param {string} prefix - string to add the random group
     * @param {number} size - longitud del grupo aleatorio
     * @return {string}
     */
    function createId(prefix, size) {
        if ( size === void 0 ) size = 5;

        var range =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            id = prefix;
        while (size) {
            --size;
            id += range.charAt(Math.floor(Math.random() * range.length));
        }
        return id;
    }
    /**
     * create a unique classname
     * @param {string} prefix - string to add the random group
     * @param {number} size - longitud del grupo aleatorio
     * @return {string}.
     */
    function createUniqueClassName(prefix, size) {
        if ( prefix === void 0 ) prefix = "";
        if ( size === void 0 ) size = 5;

        var className = createId(prefix, size);
        if (document.getElementsByClassName(className).length) {
            return createUniqueClassName(prefix, size + 1);
        } else {
            return className;
        }
    }
    /**
     * insert the style rules in the given style tag
     */
    var Sheet = function Sheet(rules, style) {
        this.rules = rules;
        this.style = style;
    };
    /**
     * Insert a rule in the document
     * @param {string} rule
     */
    Sheet.prototype.insert = function insert (rule) {
        var sheet = this.style.sheet;
        try {
            sheet.insertRule(rule, sheet.cssRules.length);
        } catch (error) {
            throw rule;
        }
    };
    /**
     * Insert the style tag the rules
     * @param {object} root - first argument for template functions
     */
    Sheet.prototype.print = function print (root) {
            var this$1 = this;

        this.rules.forEach(function (rule) {
            this$1.insert(rule(root));
        });
    };

    /**
     * @property {string} config.px - default value for the variable $ {root.px}
     * @property {string} config.provider -  name for the context
     * @property {array} config.ids - store ids created for the Theme component
     */
    var config = {
        px: "data-",
        provider: "[[ROOT_CSS]]",
        ids: []
    };
    /**
     * create a unique id for each component Theme
     * @param {string} prefix - string to add the random group
     * @param {number} size - longitud del grupo aleatorio
     * @return {string} id
     */
    function primaryId(prefix, size) {
        if ( prefix === void 0 ) prefix = "_";
        if ( size === void 0 ) size = 5;

        var id = createId(prefix, size);
        return config.ids.indexOf(id) > -1 ? primaryId(prefix, size + 1) : id;
    }
    /**
     * Allows to connect to the context
     */
    var Connect = (function (Component) {
        function Connect () {
            Component.apply(this, arguments);
        }

        if ( Component ) Connect.__proto__ = Component;
        Connect.prototype = Object.create( Component && Component.prototype );
        Connect.prototype.constructor = Connect;

        Connect.prototype.provider = function provider () {
            return this.context[config.provider] || { id: "default", props: {} };
        };
        /**
         *
         * @param {object} current - properties to be defined in the component
         * @param {object} props - component properties
         * @param {function} template - external render to execute if it is defined
         * @return {object} current
         */
        Connect.prototype.root = function root (current, props, template) {
            if ( current === void 0 ) current = {};

            props = props || this.props;
            for (var key in props) {
                if (
                    key !== "classs" &&
                    /string|number|boolean/.test(typeof props[key])
                ) {
                    current[config.px + key] = props[key];
                } else {
                    current[key] = props[key];
                }
            }
            if (template) {
                current.children = template(props);
            }
            if (this.state.class) {
                current.class =
                    this.state.class + (current.class ? " " + current.class : "");
            }
            return current;
        };

        return Connect;
    }(preact.Component));
    /**
     * Allows you to create unique contexts and assign properties
     */
    var Theme = (function (Component) {
        function Theme() {
            Component.call(this);
            this.state.id = primaryId();
        }

        if ( Component ) Theme.__proto__ = Component;
        Theme.prototype = Object.create( Component && Component.prototype );
        Theme.prototype.constructor = Theme;
        Theme.prototype.getChildContext = function getChildContext () {
            var obj;

            var props = Object.assign({}, this.props);
            delete props.children;
            return ( obj = {}, obj[config.provider] = {
                    id: this.state.id,
                    sheets: [],
                    props: props
                }, obj );
        };
        Theme.prototype.render = function render (ref) {
            var children = ref.children;

            return children[0];
        };

        return Theme;
    }(preact.Component));
    /**
     * Permite configurar la funcion create
     */
    function style(tagName, root) {
        if ( root === void 0 ) root = {};

        return function (rules) { return create(rules, root, tagName); };
    }
    /**
     * create a unique component for each group of rules...
     * @param {array} rules - list of rules
     * @param {object} root - object to use within the rules
     * @param {string} tagName - type of initial tag
     * @return {Component}
     */
    function create(rules, root, tagName) {
        if ( root === void 0 ) root = {};

        var sheet = new Sheet(rules, createTagStyle()),
            loads = [],
            roots = [],
            template;
        return (function (Connect) {
            function anonymous () {
                Connect.apply(this, arguments);
            }

            if ( Connect ) anonymous.__proto__ = Connect;
            anonymous.prototype = Object.create( Connect && Connect.prototype );
            anonymous.prototype.constructor = anonymous;

            anonymous.prototype.componentWillMount = function componentWillMount () {
                var provider = this.provider();
                if (loads.indexOf(provider.id) === -1) {
                    var prosp = Object.assign({}, root,
                        provider.props,
                        {px: config.px,
                        cn: createUniqueClassName("_")});
                    sheet.print(prosp);
                    loads.push(provider.id);
                    roots.push(prosp);
                }
                this.state.class = roots[loads.indexOf(provider.id)].cn;
            };
            anonymous.prototype.render = function render () {
                return preact.h(tagName, this.root({}, false, template));
            };
            /**
             * It allows to sustain the component but change the way in which its children are disposed
             * @param {*} callback
             */
            anonymous.yield = function yield$1 (callback) {
                template = callback;
                return this;
            };

            return anonymous;
        }(Connect));
    }

    exports.config = config;
    exports.primaryId = primaryId;
    exports.Connect = Connect;
    exports.Theme = Theme;
    exports.style = style;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
