import { isPresent } from '../utils';

export interface FilterDescriptor {
  field?: string | Function;
  operator: string | Function;
  value?: any;
  ignoreCase?: boolean;
}

export interface CompositeFilterDescriptor {
  logic: 'or' | 'and';
  filters: Array<FilterDescriptor | CompositeFilterDescriptor>;
}

export const isCompositeFilterDescriptor = (source: FilterDescriptor | CompositeFilterDescriptor): boolean => {
  return isPresent((source as CompositeFilterDescriptor).filters);
};
