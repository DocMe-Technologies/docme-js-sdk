// import fetchMock from './mocks/crossFetch.mock';
import './mocks/createObjectURL.mock';

import { DocMeMeasurementV1 } from '../src/classes/DocMeMeasurementV1';

jest.mock('get-blob-duration');
jest.mock('../src/classes/DocMeMeasurementV1.ts');

describe('DocMeV1', () => {
  it('should properly handle measureFromVideo', async () => {
    const blob = new Blob();

    expect(DocMeMeasurementV1.fromVideo).toBeCalledWith('token', blob);
    expect(DocMeMeasurementV1.fromVideo).toBeCalledTimes(1);
  });
});
