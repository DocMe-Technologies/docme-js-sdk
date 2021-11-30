/**
 * @jest-environment node
 */

import fetchMock from './mocks/crossFetch.mock';
import { DocMeMeasurementV1 } from '../src/classes/DocMeMeasurementV1';
import NodeFormData from 'form-data';
import { TDocMeMeasurementV1 } from '../src/@types/DocMeV1';
import fileType from 'file-type';

jest.mock('form-data');

jest.mock('file-type');

jest.mock('../src/constants', () => ({
  // @ts-ignore
  ...jest.requireActual('../src/constants'),
  IS_NODE: true,
}));

jest.mock('get-blob-duration');

const processingResponse: TDocMeMeasurementV1.ProcessingResponse = {
  id: 'fake-id',
  status: 'PROCESSING',
};

const failedResponse: TDocMeMeasurementV1.FailedResponse = {
  id: 'fake-id',
  status: 'ERROR',
  error_details: 'fake-details',
};

describe('DocMeMeasurementV1 node environment', () => {
  beforeEach(() => {
    fetchMock.mockClear();

    // @ts-ignore
    NodeFormData.mockClear();

    // @ts-ignore
    fileType.fromBuffer.mockClear();
  });

  beforeAll(() => {
    fetchMock.mockResponse(JSON.stringify(processingResponse));

    // @ts-ignore
    fileType.fromBuffer.mockResolvedValueOnce({ mime: 'video/webm' });
  });

  it('should throw if server responds with error', () => {
    expect.assertions(1);

    fetchMock.mockResponseOnce(JSON.stringify(failedResponse));

    return expect(
      DocMeMeasurementV1.fromVideo('', Buffer.from(''))
    ).rejects.toThrow();
  });

  it('should throw if second argument is not a buffer', () => {
    expect.assertions(1);
    return expect(
      // @ts-ignore
      DocMeMeasurementV1.fromVideo('', 'not a buffer')
    ).rejects.toThrow();
  });

  it('should call fromBuffer', async () => {
    await DocMeMeasurementV1.fromVideo('', Buffer.from(''));

    expect(fileType.fromBuffer).toBeCalledTimes(1);
  });
  it('should call NodeFormData', async () => {
    await DocMeMeasurementV1.fromVideo('', Buffer.from(''));

    expect.assertions(2);

    expect(fetchMock).toBeCalledTimes(1);
    expect(NodeFormData).toBeCalledTimes(1);
  });
});
