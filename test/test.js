describe('CssSelectorExtract', () => {
  const cssSelectorExtract = require('../');
  const expect = require('chai').expect;
  const fs = require('fs');

  const css = fs.readFileSync('test/css/test.scss').toString();

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
      let referenceCss = fs.readFileSync('test/css/reference/test1.scss').toString();
      let selectors = ['.test1'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    /**
     * .test2
     */
    it('correct way to extract nested selector (CSS): should return `.nested .test2` selector', () => {
      let referenceCss = fs.readFileSync('test/css/reference/test2.scss').toString();
      let selectors = ['.nested .test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
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
      let referenceCss = fs.readFileSync('test/css/reference/test3.scss').toString();
      let selectors = ['.nested', '.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
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
      let referenceCss = fs.readFileSync('test/css/reference/test4.scss').toString();
      let selectors = ['.test4'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
      });
    });

    /**
     * .test5
     */
    it('correct way to extract @media nested selector (SCSS): should return `.test5 @media` selector', () => {
      let referenceCss = fs.readFileSync('test/css/reference/test5.scss').toString();
      let selectors = ['.test5'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(referenceCss.trim());
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
