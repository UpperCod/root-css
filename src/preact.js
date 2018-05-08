import { h, Component } from "preact";
import Sheet from "./Sheet";
import { join } from "./utils";
import { config, createId, createTag } from "./config";

export class Theme extends Component {
    setProps(props, data = {}) {
        for (let prop in props) {
            if (!/^(children|_style|_tag|_prefix|_load|_root)$/.test(prop)) {
                data[/^on/.test(prop) ? prop : join(props._prefix, prop)] =
                    props[prop];
            }
        }
        return data;
    }
    render() {
        let props = this.props;
        props._load();
        return h(
            props._tag || "div",
            this.setProps(props, {
                class: props._root,
                children: props.children
            })
        );
    }
}

export function create(tag = "div") {
    return style => {
        style = new Sheet(style, createId("S"), config.prefix, createTag());
        return props => (
            <Theme
                {...props}
                _root={style.root}
                _tag={tag}
                _prefix={config.prefix}
                _load={() => style.load()}
            />
        );
    };
}
