/**
 * css-selector-extract
 * @author Markus Oberlehner
 */
'use strict';

import postcss from 'postcss';
import postcssScss from 'postcss-scss';

export default class CssSelectorExtract {
  constructor(options = {}) {
  }

  process(contents, selectors, selectorReplacements) {
    return postcss(postcss.plugin('postcss-extract-selectors', (options) => {
      const searchSelectorFilters = [];
      const replacementSelectorFilters = [];
      // Split the selector filters in tow arrays, one array with selectors to
      // search for and the other array with replacements for the filtered
      // selectors.
      selectorFilters.forEach((selectorFilter) => {
        let searchSelector = selectorFilter[0];
        let replacementSelector = selectorFilter[1];
        searchSelectorFilters.push(searchSelector);
        replacementSelectorFilters.push(replacementSelector || searchSelector);
      });

      return (css) => {
        css.walkRules((rule) => {
          // Split combined selectors into an array.
          let ruleSelectors = rule.selector.split(',').map((ruleSelector) => ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim());
          // Find whitelisted selectors and remove others.
          ruleSelectors.forEach((ruleSelector, index) => {
            let selectorFilterIndex = searchSelectorFilters.indexOf(ruleSelector);
            if (selectorFilterIndex != -1) {
              ruleSelectors[index] = replacementSelectorFilters[selectorFilterIndex];
            } else {
              // Set an empty value for the selector to mark it for deletion.
              ruleSelectors[index] = '';
            }
          });
          // Remove empty selectors.
          ruleSelectors = ruleSelectors.filter((ruleSelector) => ruleSelector.length > 0 || false);
          if (ruleSelectors.length) {
            rule.selector = ruleSelectors.join(',');
          } else {
            // Remove the rule.
            rule.remove();
          }
        });
      };
    })).process(contents, { syntax: postcssScss }).css;
  }
}
