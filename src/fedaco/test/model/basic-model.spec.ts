import { reflector } from '@gradii/annotation';
import { BasicModel } from '../../examples/basic.model';

describe('test basic model', () => {

  it('test basic', () => {
    const basic = new BasicModel();

    const metadata = reflector.propMetadata(BasicModel);

    expect(metadata['name'].length).toBe(1);
    expect(metadata['name'][0].columnName).toBe('name');
  });

  it('test basic model 1', () => {
    const basic = new BasicModel();
    basic.name  = 'hello';
  });
});
