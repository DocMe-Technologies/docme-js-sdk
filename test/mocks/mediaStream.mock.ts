Object.defineProperty(window, 'MediaStream', {
  writable: true,
  value: jest.fn().mockImplementation(),
});
