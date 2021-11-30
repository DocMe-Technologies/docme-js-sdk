import { DocMeV1 } from '../src/classes/DocMeV1';
import getDocMe, { createBlobFromStream } from '../src/index';

describe('index', () => {
  it('should export as expected', async () => {
    const exports = await import('../src/index');
    const [, ...properties] = Object.getOwnPropertyNames(exports);

    expect(properties.length).toBe(2);
    expect(properties).toEqual(['createBlobFromStream', 'default']);
    expect(typeof getDocMe).toBe('function');
    expect(typeof createBlobFromStream).toBe('function');
  });

  it('should return a DocMe instance', () => {
    expect(getDocMe(1)).toBeInstanceOf(Function);
    // @ts-ignore
    expect(getDocMe(0)).toBe(null);
    // @ts-ignore
    expect(() => getDocMe('not a number')).toThrowError();
    expect(new (getDocMe(1)!)('')).toBeInstanceOf(DocMeV1);
  });
});
