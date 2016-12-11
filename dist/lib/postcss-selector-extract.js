'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));

/**
 * Check if a selector should be whitelisted and / or replaced.
 * @param {string} ruleSelector - The selector to check for whitelisting / replacement.
 * @param {Array} ruleParentSelectors - Array of parent selectors, child selectors get whitelisted.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @return {string} Empty string or whitelisted / replaced rule selector.
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
      return parentComparisonSelector instanceof RegExp ?
        parentComparisonSelector.test(ruleParentSelector) :
        ruleParentSelector === parentComparisonSelector;
    }, false);
    var selectorsMatch = selector instanceof RegExp && selector.test(ruleSelector);

    if (selectorsAreEqual || parentSelectorIsEqual || selectorsMatch) {
      newSelector = replacementSelector ?
        ruleSelector.replace(selector, replacementSelector) :
        ruleSelector;

      // Do not stop iterating over the selector filters if the parent selector was matched
      // because child selectors may get replaced in a further iteration.
      if (!parentSelectorIsEqual) { return true; }
    }
    return false;
  });

  return newSelector;
}

/**
 * Provide a PostCSS plugin for extracting and replacing CSS selectors.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @return {Function} PostCSS plugin.
 */
function postcssSelectorExtract(selectorFilters) {
  if ( selectorFilters === void 0 ) selectorFilters = [];

  return postcss.plugin("postcss-extract-selectors", function () { return function (nodes) {
    nodes.walkRules(function (rule) {
      var ruleSelectors = rule.selector
        .split(",")
        .map(function (ruleSelector) { return ruleSelector.replace(/(\r\n|\n|\r)/gm, "").trim(); })
        .map(function (ruleSelector) { return filterSelector(
          ruleSelector,
          rule.parent.selector ? rule.parent.selector.split(",") : [],
          selectorFilters
        ); })
        .filter(function (ruleSelector) { return ruleSelector.length > 0; });

      if (ruleSelectors.length) {
        rule.selector = ruleSelectors.join(",");
      } else {
        rule.remove();
      }
    });

    nodes.walkAtRules(function (rule) {
      // Remove empty @ rules.
      if (rule.nodes && !rule.nodes.length) {
        rule.remove();
      }
    });
  }; });
}

module.exports = postcssSelectorExtract;
