import { NgModule } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DomSanitizer } from '@angular/platform-browser';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SvgIconsService } from '../../services/svg/svg-icons.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  imports: [
    CommonModule,
    MatRippleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSliderModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    LayoutModule,
    MatBadgeModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTreeModule,
    MatStepperModule,
    MatAutocompleteModule,
    DragDropModule,
    ScrollingModule,
    MatBottomSheetModule,
  ],
  declarations: [],
  exports: [
    CommonModule,
    MatRippleModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatGridListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    LayoutModule,
    MatBadgeModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTreeModule,
    MatStepperModule,
    MatAutocompleteModule,
    DragDropModule,
    ScrollingModule,
    MatBottomSheetModule,
  ],
})
export class MaterialModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private svgIconService: SvgIconsService,
    private domSanitizer: DomSanitizer
  ) {
    for (const icon of this.svgIconService.app_icons) {
      this.matIconRegistry.addSvgIconLiteral(
        icon.name,
        this.domSanitizer.bypassSecurityTrustHtml(icon.tag)
      );
    }
  }
}
