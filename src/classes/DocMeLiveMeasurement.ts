import io from 'socket.io-client';
import { getApiUri } from '../helpers/getApiUri';

export class DocMeLiveMeasurement {
  /**
   * @private
   */
  private token: string;
  public vitals: any | null;
  public socket: ReturnType<typeof io>;
  private mediaRecorder: MediaRecorder;
  public onNewVitalsData?: (vitals: any) => any;

  private initializeListeners = () => {
    this.socket.on('connect', () => {
      this.socket.emit('start', { key: this.token });
    });

    this.socket.on('vitals', data => {
      this.vitals = data.vitals;
      if (this.onNewVitalsData) this.onNewVitalsData(data);
    });
  };

  public end = () => {
    this.socket.disconnect();
    this.mediaRecorder.stop();
  };

  constructor(token: string, stream: MediaStream, videoBitsPerSecond?: number) {
    this.token = token;
    this.vitals = null;

    this.socket = io(getApiUri(1, 'STREAMING'), {
      transports: ['websocket'],
    });

    this.initializeListeners();

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: videoBitsPerSecond,
    });

    this.mediaRecorder.start(1000);

    this.mediaRecorder.ondataavailable = ({ data }) => {
      if (this.socket.connected) {
        this.socket.emit('chunk', data);
      }
    };
  }
}
