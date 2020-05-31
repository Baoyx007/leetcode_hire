export interface ErrorMessage {
  message: string;
  stack: Array<{
    line: number;
    column: number;
    filename: string;
  }>;
}

export function parseError(err: Error): ErrorMessage {
  // implement
  // err.split("\n");
  const { message } = err;
  let stack = err.stack
    ? err.stack
        .split('\n')
        .filter((s) => s.includes('http'))
        .map((s) => {
          const splitArr = s.split(':');
          let filename = splitArr.slice(0, -2).join(':');
          let [line, column] = splitArr.slice(-2);

          filename = filename.slice(filename.indexOf('http'));

          return {
            filename,
            line: parseInt(line, 10),
            column: parseInt(column, 10),
          };
        })
    : [];
  return { message, stack };
}
