import buble from "rollup-plugin-buble";

export default {
    input: "src/index.js",
    output: [
        {
            file: "build/root-css.js",
            format: "iife",
            name: "rootcss"
        },
        {
            file: "build/root-css.umd.js",
            format: "umd",
            name: "rootcss"
        },
        {
            file: "build/root-css.cjs.js",
            format: "cjs"
        },
        {
            file: "build/root-css.es.js",
            format: "es"
        }
    ],
    sourceMap: true,
    external: ["preact"],
    watch: {
        chokidar: {},
        exclude: ["node_modules/**"]
    },
    plugins: [
        buble({
            objectAssign: "Object.assign"
        })
    ]
};
