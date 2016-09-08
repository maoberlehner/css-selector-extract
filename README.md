# css-selector-extract
With selector extracting, it is possible to extract certain CSS selectors form (S)CSS code. This is especially useful if you want to extract only a few CSS classes from a huge library or framework.

## Demos
```js
var cssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
var css = '.btn { ... } .btn-alert { ... } .btn-success { ... }';
// Array of selector filter objects with selectors which should be extracted.
var selectorFilters = ['.btn'];

// Asynchronous:
cssSelectorExtract.process(css, selectorFilters).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.btn { ... }`.
});

// Synchronous:
var extractedCss = cssSelectorExtract.processSync(css, selectorFilters);
console.log(extractedCss); // Outputs: `.btn { ... }`.
```

### Rename extracted selectors
```js
var cssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
var css = '.btn { ... } .btn-alert { ... } .btn-success { ... }';
// Array of selector filter objects with selectors
// which should be extracted and replaced.
var selectorFilters = [{ selector: '.btn', replacement: '.button' }];

// Asynchronous:
cssSelectorExtract.process(css, selectorFilters).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.button { ... }`.
});
```

### Usage with syntaxes other than pure CSS
Install the corresponding postcss syntax plugin (e.g. [postcss-scss](https://www.npmjs.com/package/postcss-scss) or [postcss-less](https://www.npmjs.com/package/postcss-less)).

```js
var cssSelectorExtract = require('css-selector-extract');
var postcssScss = require('postcss-scss');

var css = '.nested { .selector { ... } }';
var selectorFilters = ['.nested', '.selector'];

// Add the postcss syntax plugin as third parameter.
cssSelectorExtract.process(css, selectorFilters, postcssScss).then((extractedCss) => {
  console.log(extractedCss);
});
```

## Development
See [CONTRIBUTING.md](https://github.com/maoberlehner/css-selector-extract/blob/master/CONTRIBUTING.md)

### Testing
```bash
npm test
```

## About
### Author
Markus Oberlehner  
Twitter: https://twitter.com/MaOberlehner

### License
MIT
