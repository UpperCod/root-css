import { h, render } from "preact";
import { style } from "root-css";
import rules from "./style.root.css";
import Title from "./components/title";

let Layout = style("main")(rules);

render(
    <Layout>
        <Title>normal</Title>
        <Title size="small">small</Title>
        <Title size="medium">medium</Title>
    </Layout>,
    document.body
);
