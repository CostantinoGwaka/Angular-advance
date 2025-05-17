import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { isObservable } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Pipe({
    name: 'optionsObservable',
    standalone: true
})
export class OptionsObservablePipe implements PipeTransform {

  transform(val: Observable<any[]> | any[]): Observable<{
    loading: boolean;
    value: any;
  } | {
    loading: boolean;
    value: any[];
  } | {
    loading: boolean;
    error: any;
    value: any[];
  }> {
    return isObservable(val) ? val.pipe(
      map((v: any) => ({ loading: false, value: v || [] })),
      startWith({ loading: true, value: [] }),
      catchError(error => of({ loading: false, error, value: [] }))
    ) : of({ loading: false, value: val });
  }


}
