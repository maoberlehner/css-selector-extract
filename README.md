# css-selector-extract
With selector extracting, it is possible to extract certain CSS selectors form (S)CSS code. This is especially useful if you want to extract only a few CSS classes from a huge library or framework.

## Demos
```js
var cssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
var css = '.btn { ... } .btn-alert { ... } .btn-success { ... }';
// Array of selectors which should be extracted.
var selectors = ['.btn'];

// Asynchronous:
cssSelectorExtract.process(css, selectors).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.btn { ... }`.
});

// Synchronous:
var extractedCss = cssSelectorExtract.processSync(css, selectors);
console.log(extractedCss); // Outputs: `.btn { ... }`.
```

### Rename extracted selectors
```js
var cssSelectorExtract = require('css-selector-extract');

// CSS source code as string.
var css = '.btn { ... } .btn-alert { ... } .btn-success { ... }';
// Array of selectors which should be extracted.
var selectors = ['.btn'];
// Define replacements for extracted selectors.
var replacementSelectors = { '.btn': '.button' };

// Asynchronous:
cssSelectorExtract.process(css, selectors, replacementSelectors).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.button { ... }`.
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
