# root-css

It is a **small** utility to create styles, for **preact**, with some ideas of **css-block** and **styled-components**.

| formato |tamaño|
|--------|---|
| normal |7.07kb |
| min | 2.48kb |
| gzip | 1.37kb |

The operation of **root-css** is simple, separates the rules en bloc and replaces the root word with a randomly generated alias, **root-css** does not optimize styles, it only prints them.

## Gameplay

If you are anxious and do not want to read the small documentation, you can easily test **root-css** in [codesandbox.io/s/jjpnknv605](https://codesandbox.io/s/jjpnknv605), I invite you to read the code, edit it and comment improvements.

## :root

The magic of **root-css** is in the use of the prefix **:root**, and with the ud you can use the attribute selector `: root [attribute = value]`.

```js
import style from "root-css";

let Title = style("div")(`
   :root{
       font-size : 22px;
   }
   :root[size=large]{
       font-size : 26px;
   }
   :root[size=small]{
       font-size : 18px;
   }
`);
```

With **root-css** you can share the state of the component with the style sheet natively, as the following example shows:

```js
// Component
<Title size="large">
   hello!
</Title>
// return render
<div data-state-size="large">
   hello!
</div>
```

> **root-css** will convert `:root[size=large]` to `.SybQrQ[data-state-size=large]`, understanding that the name of the class **SybQrQ** is unique for each component invoked by **root-css**.

## :global

Allows you to insert styles globally.

```js
import style from "root-css";

let Title = style("div")(`
   :global body{
       font-family : arial;
   }
`);
```

## :rootName

Will be replaced by the random name assigned to the component, this does not prefix the point, as if it is done by **:root**.

```js
import style from "root-css";

let Title = style("div")(`
   :root{
       width: 100px;
       height: 100px;
       background: black;
       position :relative;
       animation: :rootName-mymove 5s infinite;
   }
   @keyframes :rootName-mymove {
       from {top: 0px;}
       to {top: 200px;}
   }
`);
```

## selectors

I recommend the use of **: root ** only when you want to point to it or to a component state, because by default. **root-css** adds the prefix of root to any selector inside it.

**JS** : the style will only be applied if a **button** is added within **Title**.
```js
import style from "root-css";

let Title = style("div")(`
   button,
   a{
       padding : 5px 10px;
       background : black;
       color : white;
       font-size : 12px;
   }
`);
```
**CSS** : this would be the output of the css from the previous example.
```css
.SybQrQ  button,
.SybQrQ  a{
   padding : 5px 10px;
   background : black;
   color : white;
   font-size : 12px;
}
```

## @media

You are free to build your css as you normally do using @media, @font, @keyframes or others.

```js
import style from "root-css";

let Title = style("div")(`
   @media (max-width:320px){
       button,
       a{
            padding : 5px 10px;
           background : black;
           color : white;
           font-size : 12px;
       }
   }
`);
```
**CSS** : this would be the output of the css from the previous example.
```css
@media (max-width:320px){
   .SybQrQ  button,
   .SybQrQ  a{
       padding : 5px 10px;
       background : black;
       color : white;
       font-size : 12px;
   }
}
```

Your css is still the same, only oriented to components.
