import { PageNode } from '../src/nodes/nodes';
import { StoveGenerator } from '../src/stove-generator';
import model from './test-data/page1.model';

describe('test generator', () => {
  it('test generator init', () => {
    const generator = new StoveGenerator(model as PageNode);
    expect(generator).toBeDefined();
  });

  it('test generator model', () => {
    const generator = new StoveGenerator(model);
    expect(generator).toBeDefined();
  });


});
