import { TestBed } from '@angular/core/testing';

import { GraphqlLoggerInterceptor } from './graphql-logger.interceptor';

describe('GraphqlLoggerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GraphqlLoggerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GraphqlLoggerInterceptor = TestBed.inject(GraphqlLoggerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
