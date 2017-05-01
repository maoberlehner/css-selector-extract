/* eslint-env node, mocha */
import { expect } from 'chai';

import filterSelector from '../../js/lib/filter-selector';

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
      replacement: `.some-other-replaced-selector`,
    }];

    expect(filterSelector(ruleSelector, ruleParentSelectors, selectorFilters))
      .to.equal(ruleSelector);
  });
});