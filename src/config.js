export let config = {
    prefix: "data-state-",
    tag: false,
    ids: []
};

export function createId(prefix = "", size = 5) {
    let range =
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

export function createTag() {
    if (config.tag) return config.tag;
    config.tag = document.createElement("style");
    config.tag.dataset.componentsStyles = "";
    document.head.appendChild(config.tag);
    return config.tag;
}
