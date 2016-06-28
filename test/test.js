describe('CssSelectorExtract', function() {
  var cssSelectorExtract = require('../');
  var expect = require('chai').expect;
  var fs = require('fs');

  var css = fs.readFileSync('test/test.scss').toString();

  describe('#process()', function() {
    /**
     * .test1
     */
    it('correct way to extract default selector: returns `.test1` selector', function() {
      var selectors = ['.test1'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.test1 {
  content: 'Test 1';
}`);
      });
    });

    /**
     * .test2
     */
    it('correct way to extract nested selector (CSS): returns `.nested .test2` selector', function() {
      var selectors = ['.nested .test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.nested .test2 {
  content: 'Test 2';
}`);
      });
    });

    it('wrong way to extract nested selector (CSS): returns empty string', function() {
      var selectors = ['.test2'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test3
     */
    it('correct way to extract nested selector (SCSS): returns `.nested .test3` selector', function() {
      var selectors = ['.nested', '.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.nested {
  .test3 {
    content: 'Test 3';
  }
}`);
      });
    });

    it('wrong way to extract nested selector (SCSS): returns empty string', function() {
      var selectors = ['.test3'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal('');
      });
    });

    /**
     * .test4
     */
    it('correct way to extract @media nested selector (CSS): returns `@media .test4` selector', function() {
      var selectors = ['.test4'];
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
    it('correct way to extract @media nested selector (SCSS): returns `.test5 @media` selector', function() {
      var selectors = ['.test5'];
      return cssSelectorExtract.process(css, selectors).then((extractCss) => {
        expect(extractCss.trim()).to.equal(`.test5 {
  @media (min-width: 30em) {
    content: 'Test 5';
  }
}`);
      });
    });
  });
});
