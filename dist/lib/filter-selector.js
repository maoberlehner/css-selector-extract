'use strict';

/**
 * Check if a selector should be whitelisted and / or replaced.
 */
function filterSelector(ruleSelector, ruleParentSelectors, selectorFilters) {
  var newSelector = "";

  selectorFilters.some(function (selectorFilter) {
    var selector = selectorFilter.selector || selectorFilter;
    var replacementSelector = selectorFilter.replacement;
    var parentComparisonSelector = replacementSelector || selector;

    var selectorsAreEqual = selector === ruleSelector;
    // eslint-disable-next-line arrow-body-style
    var parentSelectorIsEqual = ruleParentSelectors.reduce(function (bool, ruleParentSelector) {
      return parentComparisonSelector instanceof RegExp ? parentComparisonSelector.test(ruleParentSelector) : ruleParentSelector === parentComparisonSelector;
    }, false);
    var selectorsMatch = selector instanceof RegExp && selector.test(ruleSelector);

    if (selectorsAreEqual || parentSelectorIsEqual || selectorsMatch) {
      newSelector = replacementSelector ? ruleSelector.replace(selector, replacementSelector) : ruleSelector;

      // Do not stop iterating over the selector filters if the parent selector was matched
      // because child selectors may get replaced in a further iteration.
      if (!parentSelectorIsEqual) return true;
    }
    return false;
  });

  return newSelector;
}

module.exports = filterSelector;
