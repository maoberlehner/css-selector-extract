describe('CssSelectorExtract', () => {
  const cssSelectorExtract = require('../');
  const expect = require('chai').expect;
  const fs = require('fs');

  const css = fs.readFileSync('test/test.scss').toString();

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
      let selectors = ['.test1'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.test1 {
  content: 'Test 1';
}`);
      });
    });

    /**
     * .test2
     */
    it('correct way to extract nested selector (CSS): should return `.nested .test2` selector', () => {
      let selectors = ['.nested .test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.nested .test2 {
  content: 'Test 2';
}`);
      });
    });

    it('wrong way to extract nested selector (CSS): should return empty string', () => {
      let selectors = ['.test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test3
     */
    it('correct way to extract nested selector (SCSS): should return `.nested .test3` selector', () => {
      let selectors = ['.nested', '.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.nested {
  .test3 {
    content: 'Test 3';
  }
}`);
      });
    });

    it('wrong way to extract nested selector (SCSS): should return empty string', () => {
      let selectors = ['.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test4
     */
    it('correct way to extract @media nested selector (CSS): should return `@media .test4` selector', () => {
      let selectors = ['.test4'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`@media (min-width: 30em) {
  .test4 {
    content: 'Test 4';
  }
}`);
      });
    });

    /**
     * .test5
     */
    it('correct way to extract @media nested selector (SCSS): should return `.test5 @media` selector', () => {
      let selectors = ['.test5'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.test5 {
  @media (min-width: 30em) {
    content: 'Test 5';
  }
}`);
      });
    });
  });

  describe('#processSync()', () => {
    it('should be a function', () => {
      expect(typeof cssSelectorExtract.processSync).to.equal('function');
    });
  });

  describe('#_postcssSelectorExtract()', () => {
    it('should be a function', () => {
      expect(typeof cssSelectorExtract.prototype._postcssSelectorExtract).to.equal('function');
    });

    it('should return a postcss plugin named "postcss-extract-selectors"', () => {
      expect(cssSelectorExtract.prototype._postcssSelectorExtract().postcss).to.not.be.undefined;
      expect(cssSelectorExtract.prototype._postcssSelectorExtract().postcss.postcssPlugin).to.equal('postcss-extract-selectors');
    });
  });
});
