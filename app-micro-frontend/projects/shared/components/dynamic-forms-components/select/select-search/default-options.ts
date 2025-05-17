import { InjectionToken } from '@angular/core';
import { SelectSearchComponent } from './select-search.component';

/** List of inputs of SelectSearchComponent that can be configured with a global default. */
export const configurableDefaultOptions = [
    'ariaLabel',
    'clearSearchInput',
    'closeIcon',
    'closeSvgIcon',
    'disableInitialFocus',
    'disableScrollToActiveOnOptionsChanged',
    'enableClearOnEscapePressed',
    'hideClearSearchButton',
    'noEntriesFoundLabel',
    'placeholderLabel',
    'preventHomeEndKeyPropagation',
    'searching',
] as const;

export type ConfigurableDefaultOptions = typeof configurableDefaultOptions[number];

/**
 * InjectionToken that can be used to specify global options. e.g.
 *
 * ```typescript
 * providers: [
 *   {
 *     provide: SELECTSEARCH_DEFAULT_OPTIONS,
 *     useValue: <SelectSearchOptions>{
 *       closeIcon: 'delete',
 *       noEntriesFoundLabel: 'No options found'
 *     }
 *   }
 * ]
 * ```
 *
 * See the corresponding inputs of `SelectSearchComponent` for documentation.
 */
export const SELECTSEARCH_DEFAULT_OPTIONS = new InjectionToken<SelectSearchOptions>('selectsearch-default-options');

/** Global configurable options for MatSelectSearch. */
export type SelectSearchOptions = Readonly<Partial<Pick<SelectSearchComponent, ConfigurableDefaultOptions>>>;