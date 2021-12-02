import fetchMock from './mocks/crossFetch.mock';
import './mocks/createObjectURL.mock';
import { DocMeMeasurementV1 } from '../src/classes/DocMeMeasurementV1';
import getBlobDuration from 'get-blob-duration';
import { TDocMeMeasurementV1 } from '../src/@types/DocMeV1';

jest.mock('get-blob-duration');

describe('DocMeMeasurementV1', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  beforeAll(() => {
    fetchMock.mockResponse(JSON.stringify({ id: 'fake-id' }));

    // @ts-ignore
    getBlobDuration.mockResolvedValue(99999);
  });

  it('should throw if window is defined and second argument is not a blob', () => {
    expect.assertions(1);
    return expect(
      // @ts-ignore
      DocMeMeasurementV1.fromVideo('', 'not a blob')
    ).rejects.toThrow();
  });

  it('should throw if video is less than MIN_VIDEO_DURATION', () => {
    expect.assertions(1);
    // @ts-ignore
    getBlobDuration.mockResolvedValueOnce(0);
    return expect(
      DocMeMeasurementV1.fromVideo('', new Blob())
    ).rejects.toThrow();
  });

  it('should call fetch if checks pass', async () => {
    expect.assertions(1);

    await DocMeMeasurementV1.fromVideo('', new Blob());
    await expect(fetchMock).toBeCalledTimes(1);
  });

  it('should properly handle measurement creation', async () => {
    await expect(
      DocMeMeasurementV1.fromVideo('', new Blob())
    ).resolves.toHaveProperty('id', 'fake-id');

    expect(fetchMock).toBeCalled();
  });

  it('should create an instance if you use fromVideo static method', () => {
    return expect(
      DocMeMeasurementV1.fromVideo('', new Blob())
    ).resolves.toBeInstanceOf(DocMeMeasurementV1);
  });

  describe('DocMeMeasurementV1.getDetails()', () => {
    beforeEach(() => {
      fetchMock.mockClear();
    });

    it('should throw when id is not set', async () => {
      const blankResponse: Partial<TDocMeMeasurementV1.SuccessResponse> = {};

      fetchMock.mockResponseOnce(JSON.stringify(blankResponse));

      const instance = await DocMeMeasurementV1.fromVideo('', new Blob());

      await expect(instance.getDetails()).rejects.toThrowError();

      expect(fetchMock).toBeCalledTimes(1);
    });

    it('should throw when details is defined', async () => {
      const successResponse: Partial<TDocMeMeasurementV1.SuccessResponse> = {
        id: 'fake-id',
        status: 'SUCCESS',
      };

      fetchMock.mockResponseOnce(JSON.stringify(successResponse));

      const instance = await DocMeMeasurementV1.fromVideo('', new Blob());

      await expect(instance.getDetails()).rejects.toThrowError();

      expect(fetchMock).toBeCalledTimes(1);
    });

    it('should throw when status is already failed', async () => {
      const failedResponse: TDocMeMeasurementV1.FailedResponse = {
        id: 'fake-id',
        status: 'ERROR',
        error_details: 'fake error details',
      };

      fetchMock.mockResponseOnce(JSON.stringify(failedResponse));

      const instance = await DocMeMeasurementV1.fromVideo('', new Blob());

      await expect(instance.getDetails()).rejects.toThrowError();

      expect(fetchMock).toBeCalledTimes(1);
    });

    it('should keep retrying when status is processing', async () => {
      const processingResponse: TDocMeMeasurementV1.ProcessingResponse = {
        id: 'fake-id',
        status: 'PROCESSING',
      };

      fetchMock.mockResponseOnce(JSON.stringify(processingResponse));
      fetchMock.mockResponseOnce(JSON.stringify(processingResponse));
      fetchMock.mockResponseOnce(JSON.stringify(processingResponse));

      fetchMock.mockResponseOnce(
        JSON.stringify({ id: 'fake-id', status: 'SUCCESS' })
      );

      // takes one request to complete
      const instance = await DocMeMeasurementV1.fromVideo('', new Blob());
      // takes multiple request until it receives success status, meaning it takes two failed and one successful request in this example
      await instance.getDetails();

      expect(fetchMock).toBeCalledTimes(4);
    });
  });
});
