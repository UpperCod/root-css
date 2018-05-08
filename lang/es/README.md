# root-css

Es una **pequeña** utilidad para crear estilos, para **preact**, con algunas ideas de **css-block** y **styled-components**.

| formato |tamaño|
|--------|---|
| normal |7.07kb |
| min | 2.48kb |
| gzip | 1.37kb |

El funcionamiento de **root-css** es simple, separa las reglas en bloque y reemplaza la palabra root por un alias generado de forma aleatoria, **root-css** no optimiza estilos solo los imprime.

## Gameplay

Si está ansioso y no quiere leer la pequeña documentación, puede testear fácilmente **root-css** en [codesandbox.io/s/jjpnknv605](https://codesandbox.io/s/jjpnknv605), lo invito a leer el código, editarlo y comentarme mejoras.

## :root

La magia de **root-css** esta en el uso del prefijo **:root**, ya con el ud podrá hacer uso de los selector de atributo `:root[attribute=value]`.

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

Con **root-css** usted podrá compartir el estado del componente con la hoja de estilo de forma nativa, como enseña el siguiente ejemplo:

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

> **root-css** convertira  `:root[size=large]` en `.SybQrQ[data-state-size=large]`, entendiendo que el nombre de la clase **SybQrQ** es único para cada componente invocado por **root-css**.

## :global

permite insertar estilos de forma global.

```js
import style from "root-css";

let Title = style("div")(`
   :global body{
       font-family : arial;
   }
`);
```

## :rootName

será reemplazado por el nombre aleatorio asignado al componente, este no antepone el punto, como si lo realiza **:root**.

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

## selectores

recomiendo el uso de **:root** sólo cuando usted quiere apuntar a él o a un estado del componente, ya que por defecto. **root-css** añade el prefijo de root a cualquier selector dentro de él.

**JS** : el estilo solo se aplicará si dentro de **Title** se añade un tag **button**
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
**CSS** : esta sería la salida del css del ejemplo anterior.
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

Ud es libre de construir su css como normalmente lo hace usando @media, @font, @keyframes u otros.

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
**CSS** : esta sería la salida del css del ejemplo anterior.
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

Su css seguirá siendo el mismo, solo que esta vez orientado a componentes.
