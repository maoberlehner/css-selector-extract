import postcss from 'postcss';

import postcssSelectorExtract from './lib/postcss-selector-extract';

/**
 * Synchronously extract and replace CSS selectors from a string.
 */
export const processSync = ({
  css,
  filters,
  postcssSyntax,
}) => postcss(postcssSelectorExtract(filters))
  .process(css, { syntax: postcssSyntax }).css;

/**
 * Asynchronously extract and replace CSS selectors from a string.
 */
export const process = options => new Promise((resolve) => {
  const result = processSync(options);
  resolve(result);
});

/**
 * cssSelectorExtract
 */
export default {
  process,
  processSync,
};
