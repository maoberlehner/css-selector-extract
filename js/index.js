/**
 * css-selector-extract
 * @author Markus Oberlehner
 */
import postcss from 'postcss';

export default class CssSelectorExtract {
  static process(css, selectorFilters, postcssSyntax = undefined) {
    return new Promise((resolve) => {
      const result = CssSelectorExtract.processSync(
        css,
        selectorFilters,
        postcssSyntax
      );
      resolve(result);
    });
  }

  static processSync(css, selectorFilters, postcssSyntax = undefined) {
    const postcssSelectorExtract = this.prototype.postcssSelectorExtract(selectorFilters);
    return postcss(postcssSelectorExtract).process(css, { syntax: postcssSyntax }).css;
  }

  postcssSelectorExtract(selectorFilters = []) {
    const selectors = selectorFilters.map(filter => filter.selector);
    const replacementSelectors = selectorFilters.reduce((previousValue, selectorFilter) => {
      if (selectorFilter.replacement) {
        // eslint-disable-next-line no-param-reassign
        previousValue[selectorFilter.selector] = selectorFilter.replacement;
      }
      return previousValue;
    }, {});

    return postcss.plugin('postcss-extract-selectors', () => (cssNodes) => {
      cssNodes.walkRules((rule) => {
        // Split combined selectors into an array.
        let ruleSelectors = rule.selector
          .split(',')
          .map((ruleSelector) => ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim());
        // Find whitelisted selectors and remove others.
        ruleSelectors.forEach((ruleSelector, index) => {
          const selectorFilterIndex = selectors.indexOf(ruleSelector);
          // Replace the selector if a replacement selector is defined.
          ruleSelectors[index] = replacementSelectors[ruleSelector] || ruleSelectors[index];
          if (selectorFilterIndex === -1) {
            // Set an empty value for the selector to mark it for deletion.
            ruleSelectors[index] = '';
          }
        });
        // Remove empty selectors.
        ruleSelectors = ruleSelectors.filter((ruleSelector) => ruleSelector.length > 0 || false);
        if (ruleSelectors.length) {
          rule.selector = ruleSelectors.join(','); // eslint-disable-line no-param-reassign
        } else {
          // Remove the rule.
          rule.remove();
        }
      });
      cssNodes.walkAtRules((rule) => {
        // Remove empty @ rules.
        if (rule.nodes && !rule.nodes.length) {
          rule.remove();
        }
      });
    });
  }
}
