/**
 * css-selector-extract
 * @author Markus Oberlehner
 */
import postcss from 'postcss';
import postcssScss from 'postcss-scss';

export default class CssSelectorExtract {
  process(css, selectors, replacementSelectors) {
    return new Promise((resolve, reject) => {
      let result = this.processSync(css, selectors, replacementSelectors);
      resolve(result);
    });
  }

  processSync(css, selectors, replacementSelectors) {
    return postcss(this._postcssSelectorExtract(selectors, replacementSelectors)).process(css, { syntax: postcssScss }).css;
  }

  _postcssSelectorExtract(selectors, replacementSelectors) {
    return postcss.plugin('postcss-extract-selectors', (options) => {
      return (cssNodes) => {
        cssNodes.walkRules((rule) => {
          // Split combined selectors into an array.
          let ruleSelectors = rule.selector.split(',').map((ruleSelector) => ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim());
          // Find whitelisted selectors and remove others.
          ruleSelectors.forEach((ruleSelector, index) => {
            let selectorFilterIndex = selectors.indexOf(ruleSelector);
            // Replace the selector if a replacement selector is defined.
            ruleSelectors[index] = replacementSelectors[ruleSelector] || ruleSelectors[index];
            if (selectorFilterIndex == -1) {
              // Set an empty value for the selector to mark it for deletion.
              ruleSelectors[index] = '';
            }
          });
          // Remove empty selectors.
          ruleSelectors = ruleSelectors.filter((ruleSelector) => ruleSelector.length > 0 || false);
          if (ruleSelectors.length) {
            rule.selector = ruleSelectors.join(',');
          } else {
            // Remove the rule.
            rule.remove();
          }
        });
      };
    });
  }
}
