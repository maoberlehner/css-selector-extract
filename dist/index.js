'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));
var postcssScss = _interopDefault(require('postcss-scss'));

var CssSelectorExtract = function CssSelectorExtract () {};

CssSelectorExtract.process = function process (css, selectors, replacementSelectors) {
  return new Promise(function (resolve) {
    var result = CssSelectorExtract.processSync(css, selectors, replacementSelectors);
    resolve(result);
  });
};

CssSelectorExtract.processSync = function processSync (css, selectors, replacementSelectors) {
  var postcssSelectorExtract = this.prototype.postcssSelectorExtract(
    selectors,
    replacementSelectors
  );
  return postcss(postcssSelectorExtract).process(css, { syntax: postcssScss }).css;
};

CssSelectorExtract.prototype.postcssSelectorExtract = function postcssSelectorExtract (selectors, replacementSelectors) {
    if ( replacementSelectors === void 0 ) replacementSelectors = {};

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