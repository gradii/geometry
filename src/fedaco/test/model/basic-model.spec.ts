import { reflector } from '../../../annotation';
import { BasicModel } from '../../examples/basic.model';

describe('test basic model', () => {

  it('test basic', () => {
    const basic = new BasicModel();

    const metadata = reflector.propMetadata(BasicModel);
    console.log(metadata['name']);
  });
});
