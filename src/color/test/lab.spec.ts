import { Lab } from '../src/lab';
import { Rgb } from '../src/rgb';
import { expectEqualRgb } from './test-helper';

describe('test color lab', () => {
  it('should lab can instant', () => {
    const lab_1 = new Lab(0, 0, 0);
    expectEqualRgb(lab_1.rgb(), new Rgb(0, 0, 0));
  });

  it('should lab represent right rgb color', () => {
    const lab_1 = new Lab(1, 2, 3);
    expectEqualRgb(lab_1.rgb(), new Rgb(0x0c, 0x02, 0x00)); //d65
  });

  it('create lab can receive lab', () => {
    const lab_1 = new Lab(1, 2, 3);

    const n_lab = Lab.create(lab_1);
    expectEqualRgb(n_lab.rgb(), new Rgb(0x0c, 0x02, 0x00));
  });


});
