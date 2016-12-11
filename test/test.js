/* eslint-env node, mocha */
/* eslint-disable no-console */
const cssSelectorExtract = require(`../`);
const expect = require(`chai`).expect;
const fs = require(`fs`);
const postcssScssSyntax = require(`postcss-scss`);

const filterSelector = require(`../dist/lib/filter-selector.js`);
const postcssSelectorExtract = require(`../dist/lib/postcss-selector-extract.js`);

/** @test {filterSelector} */
describe(`filterSelector()`, () => {
  it(`should be a function`, () => {
    expect(typeof filterSelector).to.equal(`function`);
  });

  it(`should return a empty selector because the rule selector is not whitelisted`, () => {
    const ruleSelector = `.some-selector`;
    const ruleParentSelectors = [];
    const selectorFilters = [`.some-other-selector`];

    expect(filterSelector(ruleSelector, ruleParentSelectors, selectorFilters))
      .to.equal(``);
  });

  it(`should return the rule selector because it is whitelisted`, () => {
    const ruleSelector = `.some-selector`;
    const ruleParentSelectors = [];
    const selectorFilters = [`.some-selector`];

    expect(filterSelector(ruleSelector, ruleParentSelectors, selectorFilters))
      .to.equal(ruleSelector);
  });

  it(`should return the rule selector because it is whitelisted (RegEx)`, () => {
    const ruleSelector = `.some-selector`;
    const ruleParentSelectors = [];
    const selectorFilters = [/\.some-selector/];

    expect(filterSelector(ruleSelector, ruleParentSelectors, selectorFilters))
      .to.equal(ruleSelector);
  });

  it(`should return the rule selector because the parent is whitelisted`, () => {
    const ruleSelector = `.some-selector`;
    const ruleParentSelectors = [`.some-other-selector`];
    const selectorFilters = [`.some-other-selector`];

    expect(filterSelector(ruleSelector, ruleParentSelectors, selectorFilters))
      .to.equal(ruleSelector);
  });

  it(`should return the rule selector because the parent is whitelisted (RegEx)`, () => {
    const ruleSelector = `.some-selector`;
    const ruleParentSelectors = [`.some-other-selector`];
    const selectorFilters = [/\.some-other-selector/];

    expect(filterSelector(ruleSelector, ruleParentSelectors, selectorFilters))
      .to.equal(ruleSelector);
  });

  it(`should return the rule selector because the replaced parent is whitelisted`, () => {
    const ruleSelector = `.some-selector`;
    const ruleParentSelectors = [`.some-other-replaced-selector`];
    const selectorFilters = [{
      selector: `.some-other-selector`,
      replacement: `.some-other-replaced-selector`
    }];

    expect(filterSelector(ruleSelector, ruleParentSelectors, selectorFilters))
      .to.equal(ruleSelector);
  });
});

/** @test {postcssSelectorExtract} */
describe(`postcssSelectorExtract()`, () => {
  it(`should be a function`, () => {
    expect(typeof postcssSelectorExtract).to.equal(`function`);
  });

  it(`should return a postcss plugin named "postcss-extract-selectors"`, () => {
    // eslint-disable-next-line no-unused-expressions
    expect(postcssSelectorExtract().postcss)
      .to.not.be.undefined;
    expect(postcssSelectorExtract().postcss.postcssPlugin)
      .to.equal(`postcss-extract-selectors`);
  });
});

/** @test {CssSelectorExtract} */
describe(`CssSelectorExtract`, () => {
  const css = fs.readFileSync(`test/css/test.css`, { encoding: `utf8` });
  const scss = fs.readFileSync(`test/css/test.scss`, { encoding: `utf8` });
  const scssSyntaxTest = fs.readFileSync(`test/css/scss-syntax-test.scss`, { encoding: `utf8` });

  it(`should be a function`, () => {
    expect(typeof cssSelectorExtract).to.equal(`function`);
  });

  /** @test {CssSelectorExtract.process} */
  describe(`process()`, () => {
    it(`should be a function`, () => {
      expect(typeof cssSelectorExtract.process).to.equal(`function`);
    });

    it(`CSS: correct way to extract default selector - should return filtered selector`, () => {
      const referenceCss = fs.readFileSync(`test/css/reference/test1.css`, { encoding: `utf8` });
      const selectorFilters = [`.test-selector`];
      return cssSelectorExtract.process(css, selectorFilters)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });

    it(`CSS: correct way to extract nested selector - should return filtered selector`, () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync(`test/css/reference/test2.css`, { encoding: `utf8` });
      const selectorFilters = [`.nest .nested-test-selector`];
      return cssSelectorExtract.process(css, selectorFilters)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });

    it(`CSS: wrong way to extract nested selector - should return empty string`, () => {
      const selectorFilters = [`.nested-test-selector`];
      return cssSelectorExtract.process(css, selectorFilters)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(``);
        });
    });

    it(`CSS: correct way to extract @media nested selector - should return filtered selector`, () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync(`test/css/reference/test3.css`, { encoding: `utf8` });
      const selectorFilters = [`.nested-in-media-query`];
      return cssSelectorExtract.process(css, selectorFilters)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });

    it(`CSS: selector replacement - should return replaced selector`, () => {
      const referenceCss = fs.readFileSync(`test/css/reference/test4.css`, { encoding: `utf8` });
      const selectorFilters = [{
        selector: `.test-selector`,
        replacement: `.test-selector-replaced`
      }];
      return cssSelectorExtract.process(css, selectorFilters)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });

    it(`SCSS: wrong way to extract nested selector - should return empty string`, () => {
      const selectorFilters = [`.nested-test-selector`];
      return cssSelectorExtract.process(scss, selectorFilters, postcssScssSyntax)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(``);
        });
    });

    it(`SCSS: extract multiple instances of a selector with nested child selectors - should return the selectors with all nested selectors`, () => { // eslint-disable-line max-len
      const referenceScss = fs.readFileSync(`test/css/reference/test5.scss`, { encoding: `utf8` });
      const selectorFilters = [
        `.nest`,
        `.commma-nest-test`,
        {
          selector: `.replace-nest-test`,
          replacement: `.replaced-nest-test`
        },
        {
          selector: `.replace-nested-test-selector`,
          replacement: `.replaced-nested-test-selector`
        }
      ];
      return cssSelectorExtract.process(scss, selectorFilters, postcssScssSyntax)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceScss.trim());
        });
    });

    it(`SCSS: correct way to extract @media nested selector - should return filtered selector`, () => { // eslint-disable-line max-len
      const referenceScss = fs.readFileSync(`test/css/reference/test6.scss`, { encoding: `utf8` });
      const selectorFilters = [`.media-query-in-test-selector`];
      return cssSelectorExtract.process(scss, selectorFilters, postcssScssSyntax)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceScss.trim());
        });
    });

    it(`SCSS: test SCSS syntax - should finish without errors`, () => {
      const referenceScss = fs.readFileSync(`test/css/reference/test7.scss`, { encoding: `utf8` });
      const selectorFilters = [`.none`];
      return cssSelectorExtract.process(scssSyntaxTest, selectorFilters, postcssScssSyntax)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceScss.trim());
        });
    });

    it(`RegEx: extract selectors using regular expressions`, () => {
      const referenceCss = fs.readFileSync(`test/css/reference/test8.css`, { encoding: `utf8` });
      const selectorFilters = [/^\.test-.*/];
      return cssSelectorExtract.process(css, selectorFilters)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });

    it(`RegEx: extract and replace selectors using regular expressions`, () => {
      const referenceCss = fs.readFileSync(`test/css/reference/test9.css`, { encoding: `utf8` });
      const selectorFilters = [{
        selector: /^\.test-(.+)-(.+).*/,
        replacement: `.test__$1--$2`
      }];
      return cssSelectorExtract.process(css, selectorFilters)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });

    it(`Bootstrap: extract and replace selectors using regular expressions`, () => {
      const bootstrapCss = fs.readFileSync(`node_modules/bootstrap/scss/_alert.scss`, {
        encoding: `utf8`
      });
      const referenceCss = fs.readFileSync(`test/css/reference/test10.scss`, { encoding: `utf8` });
      const selectorFilters = [
        `.alert`,
        `.close`,
        {
          selector: `.alert-heading`,
          replacement: `.alert__heading`
        },
        {
          selector: `.alert-link`,
          replacement: `.alert__link`
        },
        {
          selector: /^\.alert-(.+)/,
          replacement: `.alert--$1`
        }
      ];
      return cssSelectorExtract.process(bootstrapCss, selectorFilters, postcssScssSyntax)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });
  });

  /** @test {CssSelectorExtract.processSync} */
  describe(`processSync()`, () => {
    it(`should be a function`, () => {
      expect(typeof cssSelectorExtract.processSync).to.equal(`function`);
    });
  });
});
