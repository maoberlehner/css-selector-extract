import postcss from 'postcss';

import postcssSelectorExtract from './lib/postcss-selector-extract';

/**
 * Synchronously extract and replace CSS selectors from a string.
 * @param {string} css - CSS code.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @param {Object} postcssSyntax - PostCSS syntax plugin.
 * @return {string} Extracted selectors.
 */
export const processSync = (
  css,
  selectorFilters,
  postcssSyntax,
) => postcss(postcssSelectorExtract(selectorFilters))
  .process(css, { syntax: postcssSyntax }).css;

/**
 * Asynchronously extract and replace CSS selectors from a string.
 * @param {string} css - CSS code.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @param {Object} postcssSyntax - PostCSS syntax plugin.
 * @return {Promise} Promise for a string with the extracted selectors.
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
