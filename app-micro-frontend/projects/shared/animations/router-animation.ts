import {
  animate,
  query,
  style,
  transition,
  trigger,
  stagger,
  sequence,
  state,
  group,
  animation,
  AnimationMetadata
} from '@angular/animations';
import {AnimationsService} from './animations.service';

export const ROUTE_ANIMATIONS_ELEMENTS = 'route-animations-elements';

const STEPS_ALL: any[] = [
  query(':enter > *', style({opacity: 0, position: 'fixed'}), {
    optional: true
  }),
  query(':enter .' + ROUTE_ANIMATIONS_ELEMENTS, style({opacity: 0}), {
    optional: true
  }),
  sequence([
    query(
      ':leave > *',
      [
        style({transform: 'translateY(0%)', opacity: 1}),
        animate(
          '0.2s ease-in-out',
          style({transform: 'translateY(-3%)', opacity: 0})
        ),
        style({position: 'fixed'})
      ],
      {optional: true}
    ),
    query(
      ':enter > *',
      [
        style({
          transform: 'translateY(-3%)',
          opacity: 0,
          position: 'static'
        }),
        animate(
          '0.4s ease-in-out',
          style({transform: 'translateY(0%)', opacity: 1})
        )
      ],
      {optional: true}
    )
  ]),
  query(
    ':enter .' + ROUTE_ANIMATIONS_ELEMENTS,
    stagger(100, [
      style({transform: 'translateY(15%)', opacity: 0}),
      animate(
        '0.4s ease-in-out',
        style({transform: 'translateY(0%)', opacity: 1})
      )
    ]),
    {optional: true}
  )
];
const STEPS_NONE: AnimationMetadata | AnimationMetadata[] = [];
const STEPS_PAGE = [STEPS_ALL[0], STEPS_ALL[2]];
const STEPS_ELEMENTS = [STEPS_ALL[1], STEPS_ALL[3]];

export const routeAnimations = trigger('routeAnimations', [
  transition(isRouteAnimationsAll, STEPS_ALL),
  transition(isRouteAnimationsNone, STEPS_NONE),
  transition(isRouteAnimationsPage, STEPS_PAGE),
  transition(isRouteAnimationsElements, STEPS_ELEMENTS)
]);

export function isRouteAnimationsAll() {
  return AnimationsService.isRouteAnimationsType('ALL');
}

export function isRouteAnimationsNone() {
  return AnimationsService.isRouteAnimationsType('NONE');
}

export function isRouteAnimationsPage() {
  return AnimationsService.isRouteAnimationsType('PAGE');
}

export function isRouteAnimationsElements() {
  return AnimationsService.isRouteAnimationsType('ELEMENTS');
}

export const fadeStagger = trigger('fadeStagger', [
  transition('* => *', [
    query(
        ':enter',
        stagger(100, [
          style({ transform: 'translateY(15%)', opacity: 0 }),
          animate(
              '0.4s ease-in-out',
              style({ transform: 'translateY(0%)', opacity: 1 })
          )
        ]),
        { optional: true }
    )
  ]),
]);

export const fadeIn = trigger('fadeIn', [
  state('void',  style({ transform: 'translateY(15%)', opacity: 0 })),
  transition(':enter',
      animate(
          '0.5s ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
      ))
]);

export const fadeSmooth = trigger('fadeSmooth', [
  state('void', style({ opacity: 0.3 })),
  transition(':enter', [
    style({ transform: 'translateY(15%)' }),
    group([
      animate('300ms', style({ transform: 'translateY(0)' })),
      animate('300ms', style({ opacity: 1 }))
    ])
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0)' }),
    group([
      animate('300ms', style({ transform: 'translateY(100%)' })),
      animate('300ms', style({ opacity: 0 }))
    ])
  ])
]);

export const fadeOut = trigger('fadeOut', [
  state('void',  style({ transform: 'translateY(0%)', opacity: 1 })),
  transition(':leave',
      animate(
          '0.3s ease-in-out',
          style({ transform: 'translateY(15%)', opacity: 0 })
      ))
]);

export const fadeOut3 = trigger('fadeOut', [
  state('void',  style({ transform: 'translateY(0%)', opacity: 1 })),
  transition(':leave',
    animate(
      '0.3s ease-in',
      style({ transform: 'translateY(105%)', opacity: 0 })
    ))
]);

export const fadeInOut = trigger('fadeInOut', [
  state('void', style({ opacity: 0 })),
  transition(':enter', animate('300ms ease-in')),
  transition(':leave', animate('300ms ease-in'))
]);

export const listStateTrigger = trigger('listState', [
  transition('* => *', [
    query(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'translateY(15%)'
          }),
          stagger(100, [
            group([
              animate(
                  '400ms ease-out',
                  style({
                    opacity: 1,
                    offset: 1
                  })
              ),
              animate(
                  '300ms ease-out',
                  style({
                    transform: 'translateY(0)'
                  })
              )
            ])
          ])
        ],
        { optional: true }
    )
  ])
]);

export const listState = animation([
  transition('* => *', [
    query(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'translateY(15%)'
          }),
          stagger(100, [
            group([
              animate(
                  '400ms ease-out',
                  style({
                    opacity: 1,
                    offset: 1
                  })
              ),
              animate(
                  '300ms ease-out',
                  style({
                    transform: 'translateY(0)'
                  })
              )
            ])
          ])
        ],
        { optional: true }
    )
  ])
]);

export const listAnimation = animation(
    [
      query(':enter', [style({ opacity: 0, height: 0 })], { optional: true }),

      query(
          ':leave',
          [
            style({ opacity: 1, height: '*' }),
            animate('{{ time }}', style({ opacity: 0, height: 0 }))
          ],
          { optional: true }
      ),

      query(
          ':enter',
          stagger('300ms', [
            group([
              animate(
                  '{{ time }}',
                  style({
                    opacity: 1,
                    offset: 1
                  })
              ),
              animate(
                  '{{ time }}',
                  style({
                    transform: 'translateY(0)'
                  })
              )
            ])
          ]),
          { optional: true }
      )
    ],
    { params: { time: '.6s ease' } }
);

export const itemAnimation = animation(
    [
      query('.item', style({ opacity: 0, height: 0 }), { optional: true }),
      query(
          '.item',
          [
            stagger(300, [
              group([
                animate(
                    '{{ time }}',
                    style({
                      opacity: 1,
                      offset: 1
                    })
                ),
                animate(
                    '{{ time }}',
                    style({
                      transform: 'translateY(0)'
                    })
                )
              ])
            ])
          ],
          { optional: true }
      )
    ],
    { params: { time: '.6s ease' } }
);


export const tableSize = trigger('tableSize', [
  state('eighty' , style({
    width: '62%',
    'margin-right': '2%',
    float: 'left'
  })),
  state('sixty' , style({
    width: '42%',
    'margin-right': '2%',
    float: 'left'
  })),
  state('largeForm' , style({
    width: '23%',
    'margin-right': '2%',
    float: 'left'
  })),
  state('full' , style({
    width: '0%',
    'margin-right': '0%',
    opacity: '0',
    float: 'left',
    // height: 0,
    display: 'none'
  })),
  state('hundred', style({
    width: '100%',
    float: 'left'
  })),
  transition('eighty <=> hundred', animate('300ms ease-in')),
  transition('sixty <=> hundred', animate('300ms ease-in')),
  transition('largeForm <=> hundred', animate('300ms ease-in')),
  transition('full => hundred', [
    style({display: 'block'}),
    animate('300ms ease-in')
  ]),
  transition('hundred => full', animate('300ms ease-in'))
]);

export const formSize = trigger('formSize', [
  state('twenty', style({
    width: '36%',
    float: 'left',
    transform: 'scale(1, 1)'
  })),
  state('sixty', style({
    width: '56%',
    float: 'left',
    transform: 'scale(1, 1)'
  })),
  state('largeForm', style({
    width: '75%',
    float: 'left',
    transform: 'scale(1, 1)'
  })),
  state('full', style({
    width: '100%',
    float: 'left',
    transform: 'scale(1, 1)'
  })),
  state('zero', style({
    width: '0px',
    float: 'left',
    display: 'none',
    transform: 'scale(0, 0)',
  })),
  transition('twenty => zero', group([
    animate('300ms ease-in', style({opacity: 0})),
    animate('300ms ease-in', style({width: '0px'})),
    animate('300ms ease-in', style({transform: 'scale(0, 0)'}))
  ])),
  transition('zero => twenty', group([
    animate('300ms ease-in', style({opacity: 1})),
    animate('300ms ease-in', style({width: '36%'})),
    animate('300ms ease-in', style({transform: 'scale(1, 1)'}))
  ])),
  transition('sixty => zero', group([
    animate('300ms ease-in', style({opacity: 0})),
    animate('300ms ease-in', style({width: '0px'})),
    animate('300ms ease-in', style({transform: 'scale(0, 0)'}))
  ])),
  transition('zero => sixty', group([
    animate('300ms ease-in', style({opacity: 1})),
    animate('300ms ease-in', style({width: '56%'})),
    animate('300ms ease-in', style({transform: 'scale(1, 1)'}))
  ])),
  transition('largeForm => zero', group([
    animate('300ms ease-in', style({opacity: 0})),
    animate('300ms ease-in', style({width: '0px'})),
    animate('300ms ease-in', style({transform: 'scale(0, 0)'}))
  ])),
  transition('zero => largeForm', group([
    animate('300ms', style({opacity: 1})),
    animate('300ms', style({width: '75%'})),
    animate('300ms', style({transform: 'scale(1, 1)'}))
  ])),
  transition('full => zero', group([
    animate('300ms', style({opacity: 0})),
    animate('300ms', style({width: '0px'})),
    animate('300ms', style({transform: 'scale(0, 0)'}))
  ])),
  transition('zero => full', group([
    animate('300ms', style({opacity: 1})),
    animate('300ms', style({width: '100%'})),
    animate('300ms', style({transform: 'scale(1, 1)'}))
  ]))
]);
