module.exports = {
  displayName: '@gradii/check-type',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {tsconfig: '<rootDir>/tsconfig.spec.json'}
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/src/check-type',
};