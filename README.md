# root-css

Root css is a small library inspired by css-module, root-css manages to isolate its style by creating unique classnames for each component created with **preact**


## Ejemplo

Root exploits the potential of bundler tools, such as **rollup**.

The following example shows how an environment based on **root-css**, **rollup** y **preact**.

> I could see the code of this example in [/example](https://github.com/uppercod/root-css/example)


In the attached link you can see more configuration parameters for [rollup-root-css](https://github.com/UpperCod/transform-root-css/tree/master/libs)

### /example

```cmd
/example
├───components
│   └───title
│       ├───style.root.css
│       └───index.js
├───style.root.js
├───index.js
└───rollup.config.js
```

### /example/components/title/style.root.css

```css
:root {
   font-size: 30px;
   &[size=small] {
       font-size: 10px;
   }
   &[size=medium] {
       font-size: 20px;
   }
}
```

> Please note that root allows to use the attribute selectors, this is the way the `:root` selector communicates with the component.

### /example/components/title/index.js

```js
import rules from "./style.root.css";
import { style } from "root-css";

export default style("div")(rules);
```

The **style** function within **root-css** will create a component, which allows you to isolate and print the style in the document.

### /example/index.js

```js
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
```

the above is the simple way to explain and see how to use **root-css**.

## `style(string tagName[,object root]) : function `

This function allows you to create a pre-instance configuration of a component, the return function receives as a first argument the rules to be used within the component.

```js
import rules from "./style.root.css";
import { style } from "root-css";

export default style("div",{
   primary : "crimson"
})(rules);
```

## Selectors and properties

### `:global`

The `:global` selector that allows generating global styles in the document.

```css
:global body{
   font-family : "arial";
}
```

### `root(<property>)`

Allows you to print properties of the root object given as an argument to the template function

```css
:root{
   color : root(primary);
}
```

## `<Theme/>`

the second argument given to the style function `style(string tagName [, object root])`, **root** is an object that allows properties to be transferred to the template function. You can modify the default properties by using the **Theme** component.

```js
import ...
render(
   <Theme primary="orange">
       <Layout>
           <Title>Hello!</Title>
       </Layout>
   </Theme>,
   document.body
)
```

> In the previous example, if title had the default property defined inside the ** root ** object, the **Theme** component will replace this property with "orange", but this replacement applies only to the context within **Theme**.