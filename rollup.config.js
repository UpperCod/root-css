import buble from "rollup-plugin-buble";

const NAME = "rootCss";

export default {
    input: "src/index.js",
    output: [
        {
            file: "build/umd.js",
            format: "umd",
            name: NAME
        },
        {
            file: "build/cjs.js",
            format: "cjs"
        },
        {
            file: "build/iife.js",
            format: "iife",
            name: NAME
        }
    ],
    external: ["preact"],
    plugins: [
        buble({
            jsx: "h",
            objectAssign: "Object.assign"
        })
    ]
};
