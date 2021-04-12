module.exports = {
  displayName: '@gradii/date-math',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {tsconfig: '<rootDir>/tsconfig.spec.json'}
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/src/date-math',
};
