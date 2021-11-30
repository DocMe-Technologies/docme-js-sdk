import { DocMeLiveMeasurement } from './DocMeLiveMeasurement';
import { DocMeMeasurementV1 } from './DocMeMeasurementV1';

export class DocMeV1 {
  /**
   * @private
   */
  private token: string;
  /**
   * An array of measurements collected from previous measurements
   * @public
   */
  public measurements: DocMeMeasurementV1[];

  /**
   * Creates a measurement instance from a video Blob or Buffer
   * @param video - The video as a Blob or Buffer
   * @param {boolean} [waitForProcessing=false] - An option if you want the method to return the completed measurement promise
   * @returns {Object} - DocMeMeasurementV1 instance
   */
  public measureFromVideo = async (
    video: Blob | Buffer,
    waitForProcessing = false
  ) => {
    const measurement = await DocMeMeasurementV1.fromVideo(this.token, video);

    this.measurements.push(measurement);

    if (!waitForProcessing) {
      return measurement;
    }
    await measurement.getDetails();
    return measurement;
  };

  public measureFromMediaStream = (
    mediaStream: MediaStream,
    videoBitsPerSecond?: number
  ) => {
    return new DocMeLiveMeasurement(
      this.token,
      mediaStream,
      videoBitsPerSecond
    );
  };

  /**
   * Create a DocMeV1 instance
   * @param {string} token - DocMeV1 API Token.
   */
  constructor(token: string) {
    this.token = token;
    this.measurements = [];
  }
}
