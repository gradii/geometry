# Triangle

[![Build Status](https://github.com/gradii/triangle/workflows/CI/badge.svg)](https://github.com/gradii/triangle/actions?query=workflow%3ACI)
[![Greenkeeper badge](https://badges.greenkeeper.io/gradii/triangle.svg)](https://greenkeeper.io/)


## commands
```
yarn bazel build //src/triangle:npm_package
```

```
yarn bazel build //src/triangle:npm_package --config=release
```

```
yarn bazel build //src/triangle:npm_package --config=snapshot
```

```
yarn publish $(yarn --silent bazel info bazel-bin)/src/triangle/npm_package
```

```
yarn dev-app
```
