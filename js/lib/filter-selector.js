/**
 * Check if a selector should be whitelisted and / or replaced.
 */
export default function filterSelector({
  ruleSelector,
  ruleParentSelectors,
  filters,
}) {
  let newSelector = ``;

  filters.some((selectorFilter) => {
    const selector = selectorFilter.selector || selectorFilter;
    const replacementSelector = selectorFilter.replacement;
    const parentComparisonSelector = replacementSelector || selector;

    const selectorsAreEqual = selector === ruleSelector;
    // eslint-disable-next-line arrow-body-style
    const parentSelectorIsEqual = ruleParentSelectors.reduce((bool, ruleParentSelector) => {
      return parentComparisonSelector instanceof RegExp ?
        parentComparisonSelector.test(ruleParentSelector) :
        ruleParentSelector === parentComparisonSelector;
    }, false);
    const selectorsMatch = selector instanceof RegExp && selector.test(ruleSelector);

    if (selectorsAreEqual || parentSelectorIsEqual || selectorsMatch) {
      newSelector = replacementSelector ?
        ruleSelector.replace(selector, replacementSelector) :
        ruleSelector;

      // Do not stop iterating over the selector filters if the parent selector was matched
      // because child selectors may get replaced in a further iteration.
      if (!parentSelectorIsEqual) return true;
    }
    return false;
  });

  return newSelector;
}
