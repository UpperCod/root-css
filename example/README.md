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