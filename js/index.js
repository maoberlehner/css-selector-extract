import postcss from 'postcss';

import postcssSelectorExtract from './lib/postcss-selector-extract';

/**
 * Synchronously extract and replace CSS selectors from a string.
 */
export const processSync = (
  css,
  selectorFilters,
  postcssSyntax,
) => postcss(postcssSelectorExtract(selectorFilters))
  .process(css, { syntax: postcssSyntax }).css;

/**
 * Asynchronously extract and replace CSS selectors from a string.
 */
export const process = (
  css,
  selectorFilters,
  postcssSyntax,
) => new Promise((resolve) => {
  const result = processSync(
    css,
    selectorFilters,
    postcssSyntax,
  );
  resolve(result);
});

/**
 * cssSelectorExtract
 */
export default {
  process,
  processSync,
};
