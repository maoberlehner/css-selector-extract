import * as postcss from 'postcss';

import postcssSelectorExtract = require('./lib/postcss-selector-extract');

import { IProcessOptions } from './interfaces/IProcessOptions';

/**
 * Synchronously extract and replace CSS selectors from a string.
 */
export const processSync = ({
  css,
  filters,
  postcssSyntax,
}: IProcessOptions) => postcss(postcssSelectorExtract(filters))
  .process(css, { syntax: postcssSyntax }).css;

/**
 * Asynchronously extract and replace CSS selectors from a string.
 */
export const process = (options: IProcessOptions) => new Promise((resolve) => {
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
