export const mediaRecorderMockImplementation = {
  start: jest.fn(),
  ondataavailable: jest.fn(),
  onerror: jest.fn(),
  state: '',
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
};
const init = () => {
  Object.defineProperty(window, 'MediaRecorder', {
    writable: true,
    value: jest.fn().mockImplementation(() => mediaRecorderMockImplementation),
  });

  Object.defineProperty(MediaRecorder, 'isTypeSupported', {
    writable: true,
    value: () => true,
  });
};
init();
export default init;
