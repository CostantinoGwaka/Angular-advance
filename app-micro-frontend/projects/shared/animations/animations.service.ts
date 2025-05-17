import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {
  constructor() { }

  private static routeAnimationType: RouteAnimationType = 'ALL';

  static isRouteAnimationsType(type: RouteAnimationType) {
    return AnimationsService.routeAnimationType === type;
  }

  updateRouteAnimationType(
    pageAnimations: boolean,
    elementsAnimations: boolean
  ) {
    AnimationsService.routeAnimationType =
      pageAnimations && elementsAnimations
        ? 'ALL'
        : pageAnimations
          ? 'PAGE'
          : elementsAnimations
            ? 'ELEMENTS'
            : 'NONE';
  }
}

export type RouteAnimationType = 'ALL' | 'PAGE' | 'ELEMENTS' | 'NONE';
