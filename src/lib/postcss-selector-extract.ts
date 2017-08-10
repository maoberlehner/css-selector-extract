import * as postcss from 'postcss';

import filterSelector = require('./filter-selector');

import { ISelectorFilter } from '../interfaces/ISelectorFilter';

/**
 * Provide a PostCSS plugin for extracting and replacing CSS selectors.
 */
export = function postcssSelectorExtract(filters: ISelectorFilter[]|string[] = []) {
  return postcss.plugin(`postcss-extract-selectors`, () => (nodes) => {
    // We have to force `any` type, because postcss type
    // definitions seem to be outdated.
    nodes.walkRules((rule: any) => {
      const ruleSelectors = rule.selector
        .split(`,`)
        .map((ruleSelector: any) => ruleSelector.replace(/(\r\n|\n|\r)/gm, ``).trim())
        .map((ruleSelector: any) => filterSelector({
          ruleSelector,
          ruleParentSelectors: rule.parent.selector ? rule.parent.selector.split(`,`) : [],
          filters,
        }))
        .filter((ruleSelector: any) => ruleSelector.length);

      if (ruleSelectors.length) {
        rule.selector = ruleSelectors.join(`,`);
      } else {
        rule.remove();
      }
    });

    // Remove empty @ rules.
    nodes.walkAtRules((rule) => {
      if (rule.nodes && !rule.nodes.length) {
        rule.remove();
      }
    });
  });
};