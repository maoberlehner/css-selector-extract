/* eslint-env node, mocha */
import { expect } from 'chai';

import postcssSelectorExtract from '../../js/lib/postcss-selector-extract';

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
