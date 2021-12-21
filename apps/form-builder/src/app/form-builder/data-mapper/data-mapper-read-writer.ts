export class PathDataMapperReadWriter {
  constructor(public path: string) {
  }

  read(data) {
    const paths = this.path.split('.');
    return paths.reduce((prev, p) => {
      return prev[p];
    }, data);
  }

  write(data, value) {
    const paths = this.path.split('.');
    const last = paths.pop();
    const target = paths.reduce((prev, p) => {
      return prev[p];
    }, data);

    target[last] = value;
  }
}
