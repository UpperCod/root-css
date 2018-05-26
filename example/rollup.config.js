import buble from "rollup-plugin-buble";
import rootcss from "rollup-root-css";
import resolve from "rollup-plugin-node-resolve";
import autoprefixer from "autoprefixer";

export default {
    input: "index.js",
    output: [{ file: "build/bundle.js", format: "iife", sourcemap: true }],
    watch: {
        exclude: "node_modules/**"
    },
    plugins: [
        rootcss({
            plugins: [autoprefixer({ browsers: ["last 2 versions"] })]
        }),
        resolve(),
        buble({
            jsx: "h",
            objectAssign: "Object.assign"
        })
    ]
};
