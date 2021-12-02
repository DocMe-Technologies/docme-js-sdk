import './mocks/mediaRecorder.mock';
import './mocks/mediaStream.mock';
import socketIOClient, { Socket } from 'socket.io-client';

import MockedSocket from 'socket.io-mock';
import { DocMeLiveMeasurement } from '../src/classes/DocMeLiveMeasurement';

jest.mock('socket.io-client');

describe('DocMeLiveMeasurement', () => {
  let socket: Socket;
  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    socket = new MockedSocket();

    // @ts-expect-error
    socketIOClient.mockReturnValue(socket);

    jest.spyOn(socket, 'on');
    jest.spyOn(socket, 'emit');
    jest.spyOn(socket, 'disconnect');
  });

  it('should properly end the socket connection', () => {
    new DocMeLiveMeasurement('', new MediaStream()).end();
    expect(socket.disconnect).toBeCalledTimes(1);
    expect(new MediaRecorder(new MediaStream()).stop).toBeCalledTimes(1);
  });

  it('should initialize listeners', () => {
    new DocMeLiveMeasurement('', new MediaStream());
    const mediaRecorder = new MediaRecorder(new MediaStream());

    expect(socketIOClient).toBeCalledTimes(1);

    // @ts-expect-error
    expect(socket.on.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(socket.on).toBeCalledWith('vitals', expect.any(Function));
    expect(socket.on).toBeCalledWith('connect', expect.any(Function));
    expect(mediaRecorder.start).toBeCalledTimes(1);
  });

  it('should emit chunks', () => {
    // @ts-expect-error
    socketIOClient.mockReturnValueOnce({ ...socket, connected: true });

    new DocMeLiveMeasurement('', new MediaStream());
    const mediaRecorder = new MediaRecorder(new MediaStream());

    const fakeData = { data: 'fake-data' };
    // @ts-ignore
    mediaRecorder.ondataavailable(fakeData);

    expect(socket.emit).toBeCalledWith('chunk', fakeData.data);
  });

  it('should emit start on connect', () => {
    new DocMeLiveMeasurement('fake-token', new MediaStream());

    // @ts-expect-error
    socket.socketClient.emit('connect');

    expect(socket.emit).toBeCalledWith('start', { key: 'fake-token' });
  });

  it('should call onNewVitalsData when vitals event is received', () => {
    const liveMeasurement = new DocMeLiveMeasurement(
      'fake-token',
      new MediaStream()
    );
    liveMeasurement.onNewVitalsData = jest.fn();

    // @ts-expect-error
    socket.socketClient.emit('vitals', 'fake-vitals-data');

    expect(liveMeasurement.onNewVitalsData).toBeCalledWith('fake-vitals-data');
  });
});
