/**
 * get or create and insert in the document the style tag with the given id
 * @param {string} id  - id of the style tag
 * @return {HTMLStyleElement}
 */
export function createTagStyle(id = "styles-root-css") {
    let style = document.getElementById(id);
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
export function createId(prefix, size = 5) {
    let range =
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
export function createUniqueClassName(prefix = "", size = 5) {
    let className = createId(prefix, size);
    if (document.getElementsByClassName(className).length) {
        return createUniqueClassName(prefix, size + 1);
    } else {
        return className;
    }
}
/**
 * insert the style rules in the given style tag
 */
export class Sheet {
    /**
     * @param {array} rules - has the template functions
     * @param {HTMLStyleElement} style - the rules will be inserted in the given tag
     */
    constructor(rules, style) {
        this.rules = rules;
        this.style = style;
    }
    /**
     * Insert a rule in the document
     * @param {string} rule
     */
    insert(rule) {
        let sheet = this.style.sheet;
        try {
            sheet.insertRule(rule, sheet.cssRules.length);
        } catch (error) {
            throw rule;
        }
    }
    /**
     * Insert the style tag the rules
     * @param {object} root - first argument for template functions
     */
    print(root) {
        this.rules.forEach(rule => {
            this.insert(rule(root));
        });
    }
}
