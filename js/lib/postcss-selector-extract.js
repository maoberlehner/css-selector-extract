import postcss from 'postcss';

import filterSelector from './filter-selector';

/**
 * Provide a PostCSS plugin for extracting and replacing CSS selectors.
 */
export default function postcssSelectorExtract(selectorFilters = []) {
  return postcss.plugin(`postcss-extract-selectors`, () => (nodes) => {
    nodes.walkRules((rule) => {
      const ruleSelectors = rule.selector
        .split(`,`)
        .map(ruleSelector => ruleSelector.replace(/(\r\n|\n|\r)/gm, ``).trim())
        .map(ruleSelector => filterSelector(
          ruleSelector,
          rule.parent.selector ? rule.parent.selector.split(`,`) : [],
          selectorFilters,
        ))
        .filter(ruleSelector => ruleSelector.length);

      if (ruleSelectors.length) {
        // eslint-disable-next-line no-param-reassign
        rule.selector = ruleSelectors.join(`,`);
      } else {
        rule.remove();
      }
    });

    // Remove empty @ rules.
    nodes.walkAtRules((rule) => {
      if (rule.nodes && !rule.nodes.length) rule.remove();
    });
  });
}
