import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { isObservable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

@Pipe({
    name: 'withLoading',
    standalone: true,
})
export class WithLoadingPipe implements PipeTransform {
  transform(val: any) {
    return isObservable(val)
      ? val.pipe(
        map((value: any) => ({ loading: false, value, error: null })),
        startWith({ loading: true, value: null, error: null }),
        catchError(error => of({ loading: false, error, value: null }))
      )
      : of({ value: val, loading: false, error: null });
  }
}
@Pipe({
  name: 'withLoadingNoCheck',
})
export class WithLoadingNoObsCheckPipe implements PipeTransform {
  transform(val: any) {
    return val?.pipe(
      map((value: any) => ({ loading: false, value })),
      startWith({ loading: true }),
      catchError(error => of({ loading: false, error }))
    );
  }
}
