import './mocks/mediaStream.mock';
import { DocMeLiveMeasurement } from '../src/classes/DocMeLiveMeasurement';
import { DocMeMeasurementV1 } from '../src/classes/DocMeMeasurementV1';
import { DocMeV1 } from '../src/classes/DocMeV1';

jest.mock('../src/classes/DocMeMeasurementV1');
jest.mock('../src/classes/DocMeLiveMeasurement');

describe('DocMeV1', () => {
  beforeEach(() => {
    // @ts-expect-error
    DocMeMeasurementV1.mockClear();
  });

  it('should properly call DocMeMeasurementV1.fromVideo when measureFromVideo is called', async () => {
    const blob = new Blob();
    const instance = new DocMeV1('token');

    await instance.measureFromVideo(blob);

    expect(DocMeMeasurementV1.fromVideo).toBeCalledWith('token', blob);
    expect(DocMeMeasurementV1.fromVideo).toBeCalledTimes(1);
  });

  it('should return DocMeLiveMeasurement when measureFromMediaStream is called', async () => {
    const instance = new DocMeV1('token');
    expect(instance.measureFromMediaStream(new MediaStream())).toBeInstanceOf(
      DocMeLiveMeasurement
    );
  });

  it('should call DocMeMeasurementV1.getDetails when measureFromVideo is called with true as a second argument', async () => {
    const blob = new Blob();
    const instance = new DocMeV1('token');

    const getDetailsMock = jest.fn();

    // @ts-expect-error
    DocMeMeasurementV1.fromVideo.mockResolvedValue({
      getDetails: getDetailsMock,
    });

    await instance.measureFromVideo(blob, true);

    expect(getDetailsMock).toBeCalledTimes(1);
  });
});
