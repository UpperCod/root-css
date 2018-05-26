import { h, Component } from "preact";
import {
    createTagStyle,
    createUniqueClassName,
    Sheet,
    createId
} from "./utils";

/**
 * @property {string} config.px - default value for the variable $ {root.px}
 * @property {string} config.provider -  name for the context
 * @property {array} config.ids - store ids created for the Theme component
 */
export let config = {
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
export function primaryId(prefix = "_", size = 5) {
    let id = createId(prefix, size);
    return config.ids.indexOf(id) > -1 ? primaryId(prefix, size + 1) : id;
}
/**
 * Allows to connect to the context
 */
export class Connect extends Component {
    /**
     * returns the value of the context
     */
    provider() {
        return this.context[config.provider] || { id: "default", props: {} };
    }
    /**
     *
     * @param {object} current - properties to be defined in the component
     * @param {object} props - component properties
     * @param {function} template - external render to execute if it is defined
     * @return {object} current
     */
    root(current = {}, props, template) {
        props = props || this.props;
        for (let key in props) {
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
    }
}
/**
 * Allows you to create unique contexts and assign properties
 */
export class Theme extends Component {
    constructor() {
        super();
        this.state.id = primaryId();
    }
    getChildContext() {
        let props = { ...this.props };
        delete props.children;
        return {
            [config.provider]: {
                id: this.state.id,
                sheets: [],
                props
            }
        };
    }
    render({ children }) {
        return children[0];
    }
}
/**
 * Permite configurar la funcion create
 */
export function style(tagName, root = {}) {
    return rules => create(rules, root, tagName);
}
/**
 * create a unique component for each group of rules...
 * @param {array} rules - list of rules
 * @param {object} root - object to use within the rules
 * @param {string} tagName - type of initial tag
 * @return {Component}
 */
function create(rules, root = {}, tagName) {
    let sheet = new Sheet(rules, createTagStyle()),
        loads = [],
        roots = [],
        template;
    return class extends Connect {
        componentWillMount() {
            let provider = this.provider();
            if (loads.indexOf(provider.id) === -1) {
                let prosp = {
                    ...root,
                    ...provider.props,
                    px: config.px,
                    cn: createUniqueClassName("_")
                };
                sheet.print(prosp);
                loads.push(provider.id);
                roots.push(prosp);
            }
            this.state.class = roots[loads.indexOf(provider.id)].cn;
        }
        render() {
            return h(tagName, this.root({}, false, template));
        }
        /**
         * It allows to sustain the component but change the way in which its children are disposed
         * @param {*} callback
         */
        static yield(callback) {
            template = callback;
            return this;
        }
    };
}
