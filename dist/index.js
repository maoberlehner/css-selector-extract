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

  var selectors = selectorFilters.map(
    function (filter) { return filter.selector || (typeof filter === 'string' ? filter : false); }
  );
  var replacementSelectors = selectorFilters.reduce(function (previousValue, selectorFilter) {
    if (selectorFilter.replacement) {
      // eslint-disable-next-line no-param-reassign
      previousValue[selectorFilter.selector] = selectorFilter.replacement;
    }
    return previousValue;
  }, {});

  return postcss.plugin('postcss-extract-selectors', function () { return function (cssNodes) {
    cssNodes.walkRules(function (rule) {
      // Split combined selectors into an array.
      var ruleSelectors = rule.selector
        .split(',')
        .map(function (ruleSelector) { return ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim(); });
      // Find whitelisted selectors and remove others.
      ruleSelectors.forEach(function (ruleSelector, index) {
        var selectorFilterIndex = selectors.indexOf(ruleSelector);
        // Replace the selector if a replacement selector is defined.
        ruleSelectors[index] = replacementSelectors[ruleSelector] || ruleSelectors[index];
        if (selectorFilterIndex === -1) {
          // Set an empty value for the selector to mark it for deletion.
          ruleSelectors[index] = '';
        }
      });
      // Remove empty selectors.
      ruleSelectors = ruleSelectors.filter(function (ruleSelector) { return ruleSelector.length > 0 || false; });
      if (ruleSelectors.length) {
        rule.selector = ruleSelectors.join(','); // eslint-disable-line no-param-reassign
      } else {
        // Remove the rule.
        rule.remove();
      }
    });
    cssNodes.walkAtRules(function (rule) {
      // Remove empty @ rules.
      if (rule.nodes && !rule.nodes.length) {
        rule.remove();
      }
    });
  }; });
};

module.exports = CssSelectorExtract;