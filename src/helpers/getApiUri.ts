import { STREAMING_API_URL, UPLOAD_API_URL } from '../constants';
import urlJoin from 'url-join';

export function getApiUri(
  version: 1,
  apiType: 'UPLOAD' | 'STREAMING',
  path: string[] = []
): string {
  if (typeof version !== 'number') {
    throw new Error('API Version should be a number');
  }
  if (apiType === 'STREAMING') {
    return urlJoin(STREAMING_API_URL, ...path);
  }
  if (apiType === 'UPLOAD') {
    return urlJoin(UPLOAD_API_URL, `/v${version}`, ...path);
  }
  throw new Error(`Unknown apiType ${apiType}`);
}
