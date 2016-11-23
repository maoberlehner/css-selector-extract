'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));

/**
 * CssSelectorExtract
 */
var CssSelectorExtract = function CssSelectorExtract () {};

CssSelectorExtract.process = function process (css, selectorFilters, postcssSyntax) {
    if ( postcssSyntax === void 0 ) postcssSyntax = undefined;

  return new Promise(function (resolve) {
    var result = CssSelectorExtract.processSync(
      css,
      selectorFilters,
      postcssSyntax
    );
    resolve(result);
  });
};

/**
 * Synchronously extract and replace CSS selectors from a string.
 * @param {string} css - CSS code.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @param {Object} postcssSyntax - PostCSS syntax plugin.
 * @return {string} Extracted selectors.
 */
CssSelectorExtract.processSync = function processSync (css, selectorFilters, postcssSyntax) {
    if ( postcssSyntax === void 0 ) postcssSyntax = undefined;

  var postcssSelectorExtract = this.prototype.postcssSelectorExtract(selectorFilters);
  return postcss(postcssSelectorExtract).process(css, { syntax: postcssSyntax }).css;
};

/**
 * Provide a PostCSS plugin for extracting and replacing CSS selectors.
 * @param {Array} selectorFilters - Array of selector filter objects or selectors.
 * @return {Function} PostCSS plugin.
 */
CssSelectorExtract.prototype.postcssSelectorExtract = function postcssSelectorExtract (selectorFilters) {
    if ( selectorFilters === void 0 ) selectorFilters = [];

  return postcss.plugin("postcss-extract-selectors", function () { return function (nodes) {
    nodes.walkRules(function (rule) {
      // Split combined selectors into an array.
      var ruleSelectors = rule.selector
        .split(",")
        .map(function (ruleSelector) { return ruleSelector.replace(/(\r\n|\n|\r)/gm, "").trim(); });

      ruleSelectors = ruleSelectors.map(function (ruleSelector) {
        var newSelector = "";

        selectorFilters.some(function (selectorFilter) {
          var selector = selectorFilter.selector || selectorFilter;
          var replacementSelector = selectorFilter.replacement;
          var selectorsAreEqual = selector === ruleSelector;
          var selectorsMatch = selector instanceof RegExp && selector.test(ruleSelector);

          if (selectorsAreEqual || selectorsMatch) {
            if (replacementSelector) {
              newSelector = ruleSelector.replace(selector, replacementSelector);
            } else {
              newSelector = ruleSelector;
            }
            return true;
          }
          return false;
        });

        return newSelector;
      }).filter(function (ruleSelector) { return ruleSelector.length > 0 || false; });

      if (ruleSelectors.length) {
        rule.selector = ruleSelectors.join(",");
      } else {
        // Remove the rule.
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
};

module.exports = CssSelectorExtract;
