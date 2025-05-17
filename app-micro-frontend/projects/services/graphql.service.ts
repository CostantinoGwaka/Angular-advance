import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { SaveLoaderHelper } from "./save-loader-helper.service";

export interface ErrorMetadata {
  module?: string;
  section?: string;
  description?: string;
  action?: string;
  errorText?: string;
  payload?: string;
}

export interface LoaderState {
  useBlockLoader: boolean;
  loaderMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  query(arg0: { query: import("apollo-angular").TypedDocumentNode<unknown, unknown>; variables: any; }) {
    throw new Error('Method not implemented.');
  }
  isQueryLoading = true;
  isRefreshing: boolean = false;
  options: { mutation: any; variables?: any; apolloNamespace?: string };

  constructor(
    private apollo: Apollo,
    private storageService: StorageService,
    public saveLoaderHelper: SaveLoaderHelper
  ) { }

  // async fetchData(
  //   options: {
  //     query: any;
  //     variables?: any;
  //     apolloNamespace: string;
  //   },
  //   fetchPolicy: any = 'network-only',
  //   errorPolicy: any = 'all'
  // ) {
  //   // Set default namespace and check if environment is activated to enable namespace usage
  //   let segment = 'default';
  //   if (!environment.ACTIVATE_API_INTEGRATION) {
  //     segment = options.apolloNamespace ? options.apolloNamespace : 'default';
  //   }
  //   return lastValueFrom(
  //     this.apollo.use(segment).query({
  //       query: options.query,
  //       variables: options.variables,
  //       fetchPolicy,
  //       errorPolicy,
  //     })
  //   )
  // }

  async fetchData(
    options: {
      query: any;
      variables?: any;
      apolloNamespace: string;
    },
    fetchPolicy: any = 'network-only',
    errorPolicy: any = 'all'
  ) {
    // Set loading state to true when the query starts
    this.isQueryLoading = true;

    // Set default namespace and check if environment is activated to enable namespace usage
    let segment = 'default';
    if (!environment.ACTIVATE_API_INTEGRATION) {
      segment = options.apolloNamespace ? options.apolloNamespace : 'default';
    }

    // Example usage: Check if the function is still working
    if (this.isQueryLoading) {
      this.checkAccessTokenValidity().then();
    }

    try {
      // Perform the query and await the result
      const result = await lastValueFrom(
        this.apollo.use(segment).query({
          query: options.query,
          variables: options.variables,
          fetchPolicy,
          errorPolicy,
        })
      );

      this.isQueryLoading = false; // Set loading state to false when query is done
      return result;
    } catch (error) {
      this.isQueryLoading = false; // Also set loading to false on error
      console.error('Error occurred while fetching data:', error);
      throw error; // Rethrow the error if needed
    }
  }


  async checkAccessTokenValidity() {
    setInterval(() => {
      let expireIn = parseInt(this.storageService.getItem('expireIn'));
      const currentTime = Date.now().toString();

      let timeRemaining = (expireIn - parseInt(currentTime)) / 1000;


      if (timeRemaining <= 50 && timeRemaining > 0 && !this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const refreshToken = this.storageService.getItem('refreshToken');
          if (refreshToken) {
            this.isRefreshing = false;
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          this.isRefreshing = false;
        }
      } else if (timeRemaining <= 0 && !this.isRefreshing) {
        const currentTime = Date.now(); // Current timestamp in ms
        const expireDuration = 15 * 60 * 1000; // 15 minutes = 900000 ms
        this.storageService.setItem('expireIn', (currentTime + expireDuration).toString());
      }
    }, 5000);
  }

  async watchQuery(
    options: {
      query: any;
      variables?: any;
      apolloNamespace: string;
    },
    fetchPolicy: any = 'network-only',
    errorPolicy: any = 'all'
  ) {
    // Set default namespace and check if environment is activated to enable namespace usage
    let segment = 'default';
    if (!environment.ACTIVATE_API_INTEGRATION) {
      segment = options.apolloNamespace ? options.apolloNamespace : 'default';
    }
    return firstValueFrom(
      this.apollo.use(segment).query({
        query: options.query,
        variables: options.variables,
        fetchPolicy,
        errorPolicy,
      })
    );
  }

  fetchDataObservable(
    options: {
      query: any;
      variables?: any;
      apolloNamespace: string;
    },
    fetchPolicy: any = 'network-only',
    errorPolicy: any = 'all'
  ) {
    // Set default namespace and check if environment is activated to enable namespace usage
    let segment = 'default';
    if (!environment.ACTIVATE_API_INTEGRATION) {
      segment = options.apolloNamespace ? options.apolloNamespace : 'default';
    }
    return this.apollo.use(segment).query({
      query: options.query,
      variables: options.variables,
      fetchPolicy,
      errorPolicy,
    });
  }

  async mutate(options: {
    mutation: any;
    variables?: any;
    apolloNamespace: string;
    useBlockLoader?: LoaderState;
    doNotReportError?: boolean;
  }) {
    this.options = options;
    try {
      if (options?.useBlockLoader?.useBlockLoader) {
        this.saveLoaderHelper.setLoader({
          isLoading: true,
          loaderMessage: options?.useBlockLoader?.loaderMessage ?? 'Please Wait.......Saving Data',
          hasError: false,
        });
      }

      const response = await firstValueFrom(this.mutateObservable(options));
      const mutatedEndpoint = Object.keys(response.data)[0];

      if (options?.useBlockLoader?.useBlockLoader && response.data[mutatedEndpoint]?.code === 9000) {
        this.saveLoaderHelper.setLoader({
          isLoading: false,
          loaderMessage: null,
          hasError: false,
        });
      } else {
        this.saveLoaderHelper.setLoader({
          isLoading: false,
          loaderMessage: response.data[mutatedEndpoint]?.message,
          hasError: true,
        });
      }
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  mutateObservable(options: {
    mutation: any;
    variables?: any;
    apolloNamespace: string;
    useBlockLoader?: LoaderState;
    doNotReportError?: boolean;
  }) {
    // Set default namespace and check if environment is activated to enable namespace usage
    let segment = 'default';
    if (!environment.ACTIVATE_API_INTEGRATION) {
      segment = options.apolloNamespace ? options.apolloNamespace : 'default';
    }
    return this.apollo
      .use(segment)
      .mutate(options)
      .pipe(
        map((response: any) => {
          if (response.errors && response.data == null) {
            const errorText =
              response?.errors?.message || response?.errors[0]?.message;
            throw new Error(errorText);
          }
          return response;
        }),
        catchError((e) => {
          const errorText = e.message;
          if (!options.doNotReportError) {
            // this.reportErrorFromGraph(errorMetadata);
          }
          if (options?.useBlockLoader?.useBlockLoader) {
            this.saveLoaderHelper.setLoader({
              isLoading: false,
              loaderMessage: errorText,
              hasError: true,
            });
          }
          throw new Error(e);
        })
      );
  }
}

