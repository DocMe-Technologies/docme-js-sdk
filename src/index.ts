import { DocMeV1 } from './classes/DocMeV1';
export { createBlobFromStream } from './helpers/createBlobFromStream';

/**
 * The main function used to get a specific version of the API implementation
 * @param {number} version - The number of the version you want to use
 * @returns {Function}
 */
export default function(version: 1) {
  if (typeof version !== 'number') {
    throw new Error('API Version should be a number');
  }
  if (version === 1) {
    return DocMeV1;
  }
  return null;
}
