import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';


export const fadeIn = trigger('fadeIn', [
  state('void', style({opacity: 0})),
  transition(':enter', animate('300ms ease-in')),
  // transition(':leave', animate('300ms ease-in'))
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);

