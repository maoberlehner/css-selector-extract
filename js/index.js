import postcss from 'postcss';

/**
 * CssSelectorExtract
 */
export default class CssSelectorExtract {
  /**
   * Asynchronously extract and replace CSS selectors from a string.
   * @param {string} css - CSS code.
   * @param {Array} selectorFilters - Array of selector filter objects or selectors.
   * @param {Object} postcssSyntax - PostCSS syntax plugin.
   * @return {Promise} Promise for a string with the extracted selectors.
   */
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

  /**
   * Synchronously extract and replace CSS selectors from a string.
   * @param {string} css - CSS code.
   * @param {Array} selectorFilters - Array of selector filter objects or selectors.
   * @param {Object} postcssSyntax - PostCSS syntax plugin.
   * @return {string} Extracted selectors.
   */
  static processSync(css, selectorFilters, postcssSyntax = undefined) {
    const postcssSelectorExtract = this.prototype.postcssSelectorExtract(selectorFilters);
    return postcss(postcssSelectorExtract).process(css, { syntax: postcssSyntax }).css;
  }

  /**
   * Provide a PostCSS plugin for extracting and replacing CSS selectors.
   * @param {Array} selectorFilters - Array of selector filter objects or selectors.
   * @return {Function} PostCSS plugin.
   */
  postcssSelectorExtract(selectorFilters = []) {
    return postcss.plugin('postcss-extract-selectors', () => (nodes) => {
      nodes.walkRules((rule) => {
        // Split combined selectors into an array.
        let ruleSelectors = rule.selector
          .split(',')
          .map((ruleSelector) => ruleSelector.replace(/(\r\n|\n|\r)/gm, '').trim());

        ruleSelectors = ruleSelectors.map((ruleSelector) => {
          let newSelector = '';

          selectorFilters.some((selectorFilter) => {
            const selector = selectorFilter.selector || selectorFilter;
            const replacementSelector = selectorFilter.replacement;
            const selectorsAreEqual = selector === ruleSelector;
            const selectorsMatch = selector instanceof RegExp && selector.test(ruleSelector);

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
        }).filter((ruleSelector) => ruleSelector.length > 0 || false);

        if (ruleSelectors.length) {
          rule.selector = ruleSelectors.join(',');
        } else {
          // Remove the rule.
          rule.remove();
        }
      });

      nodes.walkAtRules((rule) => {
        // Remove empty @ rules.
        if (rule.nodes && !rule.nodes.length) {
          rule.remove();
        }
      });
    });
  }
}
