import { getApiUri } from './../src/helpers/getApiUri';

describe('getApiUri', () => {
  it('should throw an error if argument are of wrong type or unknown', () => {
    // @ts-ignore
    expect(() => getApiUri('not a number', 'UPLOAD')).toThrowError();
    // @ts-ignore
    expect(() => getApiUri('1', 'UPLOAD')).toThrowError();
    // @ts-ignore
    expect(() => getApiUri(1, 'unknown')).toThrowError();
  });

  it('should return a string if arguments are of correct type and known', () => {
    expect(typeof getApiUri(1, 'STREAMING')).toBe('string');
    expect(typeof getApiUri(1, 'UPLOAD')).toBe('string');
  });

  it('path should join as expected', () => {
    expect(
      getApiUri(1, 'STREAMING', ['test', 'string']).endsWith('/test/string')
    ).toBe(true);
  });
});
