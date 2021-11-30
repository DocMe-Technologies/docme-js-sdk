import { IS_NODE } from '../constants';

export const createBlobFromStream = (
  mediaStream: MediaStream,
  videoLength: number
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    if (IS_NODE || !MediaRecorder) {
      throw new Error('This method is meant to run on the browser');
    }

    try {
      const mediaRecorderInstance = new MediaRecorder(mediaStream, {});
      mediaRecorderInstance.start();

      setTimeout(() => {
        mediaRecorderInstance.stop();
      }, videoLength);

      mediaRecorderInstance.ondataavailable = function(e) {
        resolve(e.data);
      };
    } catch (e) {
      reject(e);
    }
  });
