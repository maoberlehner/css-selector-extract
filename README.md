# css-selector-extract
With selector extracting, it is possible to extract certain CSS selectors form (S)CSS code. This is especially useful if you want to extract only a few CSS classes from a huge library or framework.

## Demos
```js
const cssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
let css = '.btn { ... } .btn-alert { ... } .btn-success { ... }';
// Array of selectors which should be extracted.
let selectors = ['.btn'];

// Asynchronous:
cssSelectorExtract.process(css, selectors).then((css) => {
  console.log(css); // Outputs: `.btn { ... }`.
});

// Synchronous:
css = cssSelectorExtract.processSync(css, selectors);
console.log(css); // Outputs: `.btn { ... }`.
```

### Rename extracted selectors
```js
const cssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
let css = '.btn { ... } .btn-alert { ... } .btn-success { ... }';
// Array of selectors which should be extracted.
let selectors = ['.btn'];
// Define replacements for extracted selectors.
let replacementSelectors = { '.btn': '.button' };

// Asynchronous:
cssSelectorExtract.process(css, selectors, replacementSelectors).then((css) => {
  console.log(css); // Outputs: `.button { ... }`.
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
