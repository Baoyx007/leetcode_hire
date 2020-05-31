interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then((i) => ({
      payload: `hello ${i}!`,
      type: "delay",
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message",
    };
  }
}

// type NotFunction = T extends Function ? never : T;

type AsyncMethod = <T, U>(input: Promise<T>) => Promise<Action<U>>;

type SyncMethod = <T, U>(action: Action<T>) => Action<U>;

// 修改 Connect 的类型，让 connected 的类型变成预期的类型

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type Connect = (
  module: EffectModule
) => {
  [P in FunctionPropertyNames<EffectModule>]: EffectModule[P] extends (
    input: Promise<infer T>
  ) => Promise<Action<infer U>>
    ? (input: T) => Action<U>
    : EffectModule[P] extends (action: Action<infer T>) => Action<infer U>
    ? (input: T) => Action<U>
    : never;
};

const connect: Connect = (m) => ({
  delay: (input: number) => ({
    type: "delay",
    payload: `hello 2`,
  }),
  setMessage: (input: Date) => ({
    type: "set-message",
    payload: input.getMilliseconds(),
  }),
});

type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};

export const connected = connect(new EffectModule());
