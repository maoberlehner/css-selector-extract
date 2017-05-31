# css-selector-extract
[![Build Status](https://travis-ci.org/maoberlehner/css-selector-extract.svg?branch=master)](https://travis-ci.org/maoberlehner/css-selector-extract)

With selector extracting, it is possible to extract certain CSS selectors (RegEx can be used to match selectors) from CSS code. This is especially useful if you want to extract only a few CSS classes from a huge library or framework.

## Demos
```js
var cssSelectorExtract = require('css-selector-extract');

var options = {
  // CSS source code as string.
  css: '.btn { } .btn-alert { } .btn-success { }',
  // Array of selectors which should get extracted.
  filters: ['.btn'],
};

// Asynchronous:
cssSelectorExtract.process(options).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.btn { }`.
});

// Synchronous:
var extractedCss = cssSelectorExtract.processSync(options);
console.log(extractedCss); // Outputs: `.btn { }`.
```

### Rename extracted selectors
```js
var cssSelectorExtract = require('css-selector-extract');

var options = {
  // CSS source code as string.
  css: '.btn { } .btn-alert { } .btn-success { }',
  // Array of selector filter objects with selectors
  // which should get extracted and replaced.
  filters: [{ selector: '.btn', replacement: '.button' }],
};

// Asynchronous:
cssSelectorExtract.process(options).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.button { }`.
});
```

### RegEx
#### Filter selectors
```js
var cssSelectorExtract = require('css-selector-extract');

var options = {
  css: '.btn { } .btn-alert { }',
  filters: [/^\..+-alert/],
};

cssSelectorExtract.process(options).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.btn-alert { }`.
});
```

#### Replace selectors
```js
var cssSelectorExtract = require('css-selector-extract');

var options = {
  css: '.btn { } .btn-alert { }',
  filters: [{ selector: /^\.btn(.*)/, replacement: '.button$1' }],
};

cssSelectorExtract.process(options).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.button { } .button-alert { }`.
});
```

### Usage with syntaxes other than pure CSS
Install the corresponding postcss syntax plugin (e.g. [postcss-scss](https://www.npmjs.com/package/postcss-scss) or [postcss-less](https://www.npmjs.com/package/postcss-less)).

```js
var cssSelectorExtract = require('css-selector-extract');
var postcssScss = require('postcss-scss');

var options = {
  css: '.nested { .selector { } }',
  filters: ['.nested'],
  postcssSyntax: postcssScss,
};

// Add the postcss syntax plugin as third parameter.
cssSelectorExtract.process(options).then((extractedCss) => {
  console.log(extractedCss);
});
```

### ES2015 named exports
```js
import { process, processSync } from 'css-selector-extract';

var options = {
  // CSS source code as string.
  css: '.btn { } .btn-alert { } .btn-success { }',
  // Array of selectors which should get extracted.
  filters: ['.btn'],
};

// Asynchronous:
process(options).then((extractedCss) => {
  console.log(extractedCss); // Outputs: `.btn { }`.
});

// Synchronous:
const extractedCss = processSync(options);
console.log(extractedCss); // Outputs: `.btn { }`.
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
Website: https://markus.oberlehner.net  
Twitter: https://twitter.com/MaOberlehner  
PayPal.me: https://paypal.me/maoberlehner

### License
MIT
