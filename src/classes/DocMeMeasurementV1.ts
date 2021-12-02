import fetch from 'cross-fetch';
import fileType from 'file-type';
import NodeFormData from 'form-data';
import { IS_NODE, MIN_VIDEO_DURATION } from '../constants';
import { getApiUri } from '../helpers/getApiUri';
import pRetry from 'p-retry';
import getBlobDuration from 'get-blob-duration';
import { TDocMeMeasurementV1 } from '../@types/DocMeV1';

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export class DocMeMeasurementV1 {
  /**
   * @private
   */
  protected token: string = '';

  /**
   * Id of the measurement
   * @public
   */
  public id?: string;

  /**
   * The details of a successful measurement
   * @public
   */
  public details?: PropType<TDocMeMeasurementV1.SuccessResponse, 'details'>;

  /**
   * The status of the measurement. NOTE: This isn't kept in sync with the server status, this just stores the last known status
   * @public
   */
  public status?: PropType<TDocMeMeasurementV1.Response, 'status'>;

  /**
   * Retrieves the details of the measurement (same as this.details) or retrieves and returns the details from a 'PROCESSING' measurement
   */
  public getDetails = async () => {
    if (this.details || this.status === 'SUCCESS')
      throw new Error('You already have the details of this measurement');
    if (this.status === 'ERROR')
      throw new Error(
        'You can not get the details from an already failed measurement'
      );
    if (!this.id || !this.status)
      throw new Error('You should initialize first');

    const apiUri = getApiUri(1, 'UPLOAD', ['measurement', this.id]);
    return pRetry(
      async () => {
        const data: TDocMeMeasurementV1.Response = await fetch(apiUri, {
          headers: { 'X-Token': this.token },
        }).then(p => p.json());

        if (data.status === 'PROCESSING') {
          throw new Error('Status is still processing');
        }

        this.status = data.status;
        if (data.status === 'SUCCESS') this.details = data.details;
        return data;
      },
      {
        forever: true,
      }
    );
  };

  private createMeasurementFromVideo = async (
    video: Blob | Buffer
  ): Promise<TDocMeMeasurementV1.ProcessingResponse> => {
    const headers = {
      mode: 'no-cors',
      'Access-Control-Allow-Origin': '*',
      'X-Token': this.token,
    };

    const apiUri = getApiUri(1, 'UPLOAD', ['measurement']);

    if (!IS_NODE) {
      const formData = new FormData();
      formData.append('video', video as Blob);

      const response = await fetch(apiUri, {
        method: 'post',
        headers,
        body: formData,
      });

      return await response.json();
    } else {
      const response = await DocMeMeasurementV1.submitVideoNode(
        video as Buffer,
        apiUri,
        this.token
      );
      if (response.status === 'PROCESSING') {
        return response;
      } else {
        throw new Error('Internal Server Error');
      }
    }
  };

  private static submitVideoNode = async (
    video: Buffer,
    apiUri: string,
    token: string
  ) => {
    const nodeFormData = new NodeFormData();
    nodeFormData.append('video', video, {
      knownLength: Buffer.byteLength(video),
      filename: 'test',
      contentType: (await fileType.fromBuffer(video as Buffer))?.mime,
    });

    const response = await fetch(apiUri, {
      method: 'POST',
      headers: {
        'X-Token': token,
        'Content-Length': String(nodeFormData.getLengthSync()),
      },
      body: nodeFormData as any,
    });
    const data = await response.json();
    return data as
      | TDocMeMeasurementV1.ProcessingResponse
      | TDocMeMeasurementV1.FailedResponse;
  };

  public static fromVideo = async (token: string, video: Blob | Buffer) => {
    if (!IS_NODE && !(video instanceof Blob)) {
      throw new Error(`Video should be an instance of blob`);
    }
    if (IS_NODE && !(video instanceof Buffer)) {
      throw new Error(`Video should be an instance of buffer`);
    }
    if (
      !IS_NODE &&
      video instanceof Blob &&
      (await getBlobDuration(video)) < MIN_VIDEO_DURATION
    ) {
      throw new Error(
        `Video duration should be at least ${MIN_VIDEO_DURATION} seconds`
      );
    }
    const instance = new DocMeMeasurementV1();
    instance.token = token;
    const res = await instance.createMeasurementFromVideo(video);
    instance.id = res.id;
    instance.status = res.status;
    return instance;
  };
}
