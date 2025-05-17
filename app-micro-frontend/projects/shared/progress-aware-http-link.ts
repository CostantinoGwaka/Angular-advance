import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from '@apollo/client/core';
import { print } from 'graphql/language/printer';

export class ProgressAwareHttpLink extends ApolloLink {
  private uri: string;
  private requestModifier: (xhr: XMLHttpRequest, operation: Operation) => void;
  private urlModifier?: (operation: Operation) => string;

  constructor(options: {
    uri: string;
    requestModifier?: (xhr: XMLHttpRequest, operation: Operation) => void;
    urlModifier?: (operation: Operation) => string;
  }) {
    super();
    this.uri = options.uri;
    this.requestModifier = options.requestModifier;
    this.urlModifier = options.urlModifier;
  }

  public override request(
    operation: Operation,
    forward: (op: Operation) => Observable<FetchResult>
  ): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      const xhr = new XMLHttpRequest();
      const body = JSON.stringify({
        operationName: operation.operationName,
        variables: operation.variables,
        query: print(operation.query),
      });

      const url = this.urlModifier ? this.urlModifier(operation) : this.uri;
      xhr.open('POST', url);

      xhr.setRequestHeader('Content-Type', 'application/json');
      // Add any additional headers here, like authentication headers.

      if (this.requestModifier) {
        this.requestModifier(xhr, operation);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            observer.next(JSON.parse(xhr.responseText));
            observer.complete();
          } else {
            observer.error(xhr.statusText);
          }
        }
      };

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;

        }
      };

      xhr.send(body);
    });
  }
}
