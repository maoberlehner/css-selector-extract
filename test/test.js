/* eslint-env node, mocha */
/* eslint-disable no-console */
const cssSelectorExtract = require('../');
const expect = require('chai').expect;
const fs = require('fs');

describe('CssSelectorExtract', () => {
  const css = fs.readFileSync('test/css/test.css', { encoding: 'utf8' });
  const scss = fs.readFileSync('test/css/test.scss', { encoding: 'utf8' });

  it('should be a function', () => {
    expect(typeof cssSelectorExtract).to.equal('function');
  });

  /**
   * process()
   */
  describe('process()', () => {
    it('should be a function', () => {
      expect(typeof cssSelectorExtract.process).to.equal('function');
    });

    /**
     * .test1
     */
    it('CSS: correct way to extract default selector - should return `.test1` selector', () => {
      const referenceCss = fs.readFileSync('test/css/reference/test1.css', { encoding: 'utf8' });
      const selectors = ['.test1'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    /**
     * .test2
     */
    it('CSS: correct way to extract nested selector - should return `.nested .test2` selector', () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync('test/css/reference/test2.css', { encoding: 'utf8' });
      const selectors = ['.nested .test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    it('CSS: wrong way to extract nested selector - should return empty string', () => {
      const selectors = ['.test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test3
     */
    it('CSS: correct way to extract @media nested selector - should return `@media .test3` selector', () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync('test/css/reference/test3.css', { encoding: 'utf8' });
      const selectors = ['.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    /**
     * .test4
     */
    it('CSS: selector replacement - should return `.test4-replaced` selector', () => {
      const referenceCss = fs.readFileSync('test/css/reference/test4.css', { encoding: 'utf8' });
      const selectors = ['.test4'];
      const replacementSelectors = { '.test4': '.test4-replaced' };
      return cssSelectorExtract.process(css, selectors, replacementSelectors)
        .then((extractCss) => {
          expect(extractCss.trim()).to.equal(referenceCss.trim());
        });
    });

    /**
     * .test5
     */
    it('SCSS: correct way to extract nested selector - should return `.nested .test5` selector', () => { // eslint-disable-line max-len
      const referenceScss = fs.readFileSync('test/css/reference/test5.scss', { encoding: 'utf8' });
      const selectors = ['.nested', '.test5'];
      return cssSelectorExtract.process(scss, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceScss.trim());
      });
    });

    it('SCSS: wrong way to extract nested selector - should return empty string', () => {
      const selectors = ['.test5'];
      return cssSelectorExtract.process(scss, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test6
     */
    it('SCSS: correct way to extract @media nested selector - should return `.test6 @media` selector', () => { // eslint-disable-line max-len
      const referenceScss = fs.readFileSync('test/css/reference/test6.scss', { encoding: 'utf8' });
      const selectors = ['.test6'];
      return cssSelectorExtract.process(scss, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceScss.trim());
      });
    });
  });

  /**
   * processSync()
   */
  describe('processSync()', () => {
    it('should be a function', () => {
      expect(typeof cssSelectorExtract.processSync).to.equal('function');
    });
  });

  /**
   * postcssSelectorExtract()
   */
  describe('postcssSelectorExtract()', () => {
    it('should be a function', () => {
      expect(typeof cssSelectorExtract.prototype.postcssSelectorExtract).to.equal('function');
    });

    it('should return a postcss plugin named "postcss-extract-selectors"', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(cssSelectorExtract.prototype.postcssSelectorExtract().postcss)
        .to.not.be.undefined;
      expect(cssSelectorExtract.prototype.postcssSelectorExtract().postcss.postcssPlugin)
        .to.equal('postcss-extract-selectors');
    });
  });
});
