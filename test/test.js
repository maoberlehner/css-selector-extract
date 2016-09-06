/* eslint-env node, mocha */
/* eslint-disable no-console */
const cssSelectorExtract = require('../');
const expect = require('chai').expect;
const fs = require('fs');

describe('CssSelectorExtract', () => {
  const css = fs.readFileSync('test/css/test.scss', { encoding: 'utf8' });

  it('should be a function', () => {
    expect(typeof cssSelectorExtract).to.equal('function');
  });

  describe('#process()', () => {
    it('should be a function', () => {
      expect(typeof cssSelectorExtract.process).to.equal('function');
    });

    /**
     * .test1
     */
    it('correct way to extract default selector: should return `.test1` selector', () => {
      const referenceCss = fs.readFileSync('test/css/reference/test1.scss', { encoding: 'utf8' });
      const selectors = ['.test1'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    /**
     * .test2
     */
    it('correct way to extract nested selector (CSS): should return `.nested .test2` selector', () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync('test/css/reference/test2.scss', { encoding: 'utf8' });
      const selectors = ['.nested .test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    it('wrong way to extract nested selector (CSS): should return empty string', () => {
      const selectors = ['.test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test3
     */
    it('correct way to extract nested selector (SCSS): should return `.nested .test3` selector', () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync('test/css/reference/test3.scss', { encoding: 'utf8' });
      const selectors = ['.nested', '.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    it('wrong way to extract nested selector (SCSS): should return empty string', () => {
      const selectors = ['.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test4
     */
    it('correct way to extract @media nested selector (CSS): should return `@media .test4` selector', () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync('test/css/reference/test4.scss', { encoding: 'utf8' });
      const selectors = ['.test4'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    /**
     * .test5
     */
    it('correct way to extract @media nested selector (SCSS): should return `.test5 @media` selector', () => { // eslint-disable-line max-len
      const referenceCss = fs.readFileSync('test/css/reference/test5.scss', { encoding: 'utf8' });
      const selectors = ['.test5'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    /**
     * .test6
     */
    it('selector replacement: should return `.test6-replaced` selector', () => {
      const referenceCss = fs.readFileSync('test/css/reference/test6.scss', { encoding: 'utf8' });
      const selectors = ['.test6'];
      const replacementSelectors = { '.test6': '.test6-replaced' };
      return cssSelectorExtract.process(css, selectors, replacementSelectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });
  });

  describe('#processSync()', () => {
    it('should be a function', () => {
      expect(typeof cssSelectorExtract.processSync).to.equal('function');
    });
  });

  describe('#postcssSelectorExtract()', () => {
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
