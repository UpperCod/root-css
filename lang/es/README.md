# root-css

Root css es una pequeña librería inspirada en css-module, root-css logra aislar su estilo creando className únicos para cada componente creado con **preact**

## Ejemplo

Root explota el potencial de las herramientas de bundler, como **rollup**.

El siguiente ejemplo enseña como es un entorno a base de **root-css**

> Pude ver el codigo de este ejemplo en [/example](https://github.com/uppercod/root-css/example)


En el vínculo adjunto puede ver más parámetros de configuración para [rollup-root-css](https://github.com/uppercod/transform-root-css/libs)

### directorio


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

> Favor note que root permite utilizar los selectores de atributo, esta es la forma en que se comunica el selector `:root` con el componente.

### /example/components/title/index.js

```js
import rules from "./style.root.css";
import { style } from "root-css";

export default style("div")(rules);
```

La función style dentro de **root-css** creará un componente, que permite aislar e imprimir el estilo en el documento.

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

lo anterior es la forma simple de explicar y ver como usar **root-css**.

## `style(string tagName[,object root]) : function `

Esta función permite crear una pre instanciar la configuración de  un futuro componente, la función de retorno recibe como primer argumento las reglas a utilizar dentro del componente.

```js
import rules from "./style.root.css";
import { style } from "root-css";

export default style("div",{
   primary : "crimson"
})(rules);
```

## Selectores y propiedades

### `:global`

selector que permite generar estilos globales en el documento.

```css
:global body{
   font-family : "arial";
}
```

### `root(<property>)`

permite imprimir propiedades del objeto root dado como argumento a la función de plantilla

```css
:root{
   color : root(primary);
}
```

## `<Theme/>`

el segundo argumento entregado a la función style `style(string tagName[, object root])`, **root** es un objeto que permite transmitir propiedades a la función de plantilla.

ud puede modificar las propiedades por default mediante el uso del componente **Theme**.

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
> En el ejemplo anterior, si title tuviera por defecto la propiedad primary definida dentro del objeto **root**, el componente **Theme** reemplazará esta propiedad por "orange", pero este reemplazo aplica solo para el contexto dentro de **Theme**.