import init, {
  mediaRecorderMockImplementation,
} from './mocks/mediaRecorder.mock';
import './mocks/mediaStream.mock';
import { createBlobFromStream } from './../src/helpers/createBlobFromStream';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('createBlobFromStream', () => {
  beforeEach(() => {
    init();
    ((setTimeout as unknown) as jest.Mock<any, any>).mockClear();
  });

  it('should throw an error if mediarecorder is undefined', () => {
    //@ts-ignore
    window.MediaRecorder = undefined;

    return expect(
      createBlobFromStream(new MediaStream(), 0)
    ).rejects.toThrowError();
  });

  it('should behave as expected', async () => {
    const response = createBlobFromStream(new MediaStream(), 0);

    expect(mediaRecorderMockImplementation.start.mock.calls.length).toBe(1);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);

    ((setTimeout as unknown) as jest.Mock).mock.calls[0][0]();

    expect(mediaRecorderMockImplementation.stop.mock.calls.length).toBe(1);
    mediaRecorderMockImplementation.ondataavailable({ data: 'fake data' });
    await expect(response).resolves.toBe('fake data');
  });

  it("should throw if it doesn't behave as expected", async () => {
    //@ts-ignore
    window.MediaRecorder = jest.fn().mockImplementation(() => ({}));

    return expect(
      createBlobFromStream(new MediaStream(), 0)
    ).rejects.toThrowError();
  });
});
