'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));

/**
 * Check if a selector should be whitelisted and / or replaced.
 */
function filterSelector(_ref) {
  var ruleSelector = _ref.ruleSelector,
      ruleParentSelectors = _ref.ruleParentSelectors,
      filters = _ref.filters;

  var newSelector = "";

  filters.some(function (selectorFilter) {
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

/**
 * Provide a PostCSS plugin for extracting and replacing CSS selectors.
 */
function postcssSelectorExtract() {
  var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return postcss.plugin('postcss-extract-selectors', function () {
    return function (nodes) {
      nodes.walkRules(function (rule) {
        var ruleSelectors = rule.selector.split(',').map(function (ruleSelector) {
          return ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim();
        }).map(function (ruleSelector) {
          return filterSelector({
            ruleSelector: ruleSelector,
            ruleParentSelectors: rule.parent.selector ? rule.parent.selector.split(',') : [],
            filters: filters
          });
        }).filter(function (ruleSelector) {
          return ruleSelector.length;
        });

        if (ruleSelectors.length) {
          // eslint-disable-next-line no-param-reassign
          rule.selector = ruleSelectors.join(',');
        } else {
          rule.remove();
        }
      });

      // Remove empty @ rules.
      nodes.walkAtRules(function (rule) {
        if (rule.nodes && !rule.nodes.length) rule.remove();
      });
    };
  });
}

/**
 * Synchronously extract and replace CSS selectors from a string.
 */
var processSync = function processSync(_ref) {
  var css = _ref.css,
      filters = _ref.filters,
      postcssSyntax = _ref.postcssSyntax;
  return postcss(postcssSelectorExtract(filters)).process(css, { syntax: postcssSyntax }).css;
};

/**
 * Asynchronously extract and replace CSS selectors from a string.
 */
var process = function process(options) {
  return new Promise(function (resolve) {
    var result = processSync(options);
    resolve(result);
  });
};

/**
 * cssSelectorExtract
 */
var index = {
  process: process,
  processSync: processSync
};

exports.processSync = processSync;
exports.process = process;
exports['default'] = index;
