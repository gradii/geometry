import { Pipe, PipeTransform } from '@angular/core';
import { SelectOption } from './option.component';

@Pipe({name: 'triOptionPipe'})
export class OptionPipe implements PipeTransform {
  transform(options: SelectOption[], value: any) {
    if (value.searchText) {
      let _options = options.filter(
        option => option.label && option.label.toLowerCase().indexOf(value.searchText.toLowerCase()) !== -1
      );
      if (value.tags) {
        _options = options.filter(
          option => option.label && option.label.toLowerCase() === value.searchText.toLowerCase()
        );
      }
      if (_options.length) {
        return _options;
      } else {
        return <SelectOption[]>[
          {
            value   : value.value,
            disabled: value.disabled,
            label   : value.notFoundContent
          }
        ];
      }
    } else {
      return options;
    }
  }
}
