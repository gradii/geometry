export type ColumnSortSettings =
  | boolean
  | {
      allowUnsort?: boolean;
    };

export type SortSettings =
  | boolean
  | ColumnSortSettings & {
      mode?: 'single' | 'multiple';
    };
const DEFAULTS: any = {
  allowUnsort: true,
  mode: 'single'
};
export const normalize: (
  ...settings: (
    | boolean
    | {
        allowUnsort?: boolean;
      }
    | (true & {
        mode?: 'single' | 'multiple';
      })
    | (false & {
        mode?: 'single' | 'multiple';
      })
    | ({
        allowUnsort?: boolean;
      } & {
        mode?: 'single' | 'multiple';
      }))[]
) => any = (...settings) => {
  return Object.assign.apply(Object, [DEFAULTS].concat(settings));
};
