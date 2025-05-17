import { EditorServieService } from '../../../../modules/templates-editor/services/editor-servie.service';
import { TemplateInfo } from '../../../../shared/interfaces';
import { MustHaveFilter } from '../../../../shared/components/paginated-data-table/must-have-filters.model';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from '../../../../apollo.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentCreatorService } from '../../document-creator.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


enum PublishTasks {
  GETTING_TEMPLATE,
  GETTING_SIMILAR_TEMPLATES,
  ARCHIVING_PREVIOUS_TEMPLATES,
  PUBLISHING_TEMPLATE,
  SCAN_PLACEHOLDERS,
}

export interface PublishTemplateData {
  templateUuid: string;
  templateName: string;
}
///Volumes/SERVER/works/programming/angular/nest-frontend-ui-kit/src/app/services/document/document-creator/
@Component({
  selector: 'app-template-publisher',
  templateUrl: './template-publisher.component.html',
  styleUrls: ['./template-publisher.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule
],
})
export class TemplatePublisherComponent implements OnInit {
  templateUuid: string = null;

  templateName: string = null;

  template: TemplateInfo;
  similarTemplates: TemplateInfo[] = [];

  task: PublishTasks = PublishTasks.GETTING_TEMPLATE;

  isLoading = true;

  publishTasks = PublishTasks;

  errorMessage: string = null;

  successMessage: string = null;

  showPublishConfirmation = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public publishTemplateData: PublishTemplateData,
    private documentCreatorService: DocumentCreatorService,
    private editorService: EditorServieService,
    private dialogRef: MatDialogRef<TemplatePublisherComponent>
  ) { }

  ngOnInit(): void {
    this.templateName = this.publishTemplateData.templateName;
    this.templateUuid = this.publishTemplateData.templateUuid;
    this.init();
  }

  async init() {
    this.showPublishConfirmation = false;
    await this.getTemplate();
  }

  async getTemplate() {
    this.initTask(PublishTasks.GETTING_TEMPLATE);
    let filters: MustHaveFilter[] = [
      {
        fieldName: 'uuid',
        operation: 'EQ',
        value1: this.templateUuid,
      },
    ];
    let templates = await this.documentCreatorService.getTemplatesByFilters(
      filters
    );
    this.isLoading = false;
    if (templates.length > 0) {
      this.template = templates[0];
      this.analyzePlaceholders();
    } else {
      this.errorMessage = 'Template not found';
    }
  }

  async analyzePlaceholders() {
    this.initTask(PublishTasks.SCAN_PLACEHOLDERS);
    let report = await this.editorService.getPlaceholdersAnalysisReport(
      this.templateUuid
    );
    this.isLoading = false;
    if (report?.placeholderAnalysis) {


      let totalPlaceholdersAnalysis = report?.placeholderAnalysis;

      let totalPlaceholderOccurrences =
        (totalPlaceholdersAnalysis.unknownPlaceholders?.length || 0) +
        (totalPlaceholdersAnalysis.unknownPlaceholdersFromSectionSettings
          ?.length || 0) +
        (totalPlaceholdersAnalysis.unknownPlaceholdersFromSectionConditions
          ?.length || 0);

      if (totalPlaceholderOccurrences > 0) {
        this.errorMessage = `This template has ${totalPlaceholderOccurrences} unknown placeholders occurrences, it cannot be published`;
      } else {
        this.getSimilarTemplates();
      }
    } else {
      this.errorMessage = 'Error while scanning placeholders';
    }
  }

  initTask(task: PublishTasks) {
    this.task = task;
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

  async getSimilarTemplates() {
    this.initTask(PublishTasks.GETTING_SIMILAR_TEMPLATES);
    let filters: MustHaveFilter[] = [
      {
        fieldName: 'uuid',
        operation: 'NE',
        value1: this.templateUuid,
      },
      {
        fieldName: 'peUuid',
        operation: 'EQ',
        value1: this.template.peUuid,
      },
      {
        fieldName: 'templateType',
        operation: 'EQ',
        value1: this.template.templateType,
      },
      {
        fieldName: 'donorUuid',
        operation: 'EQ',
        value1: this.template.donorUuid,
      },
      {
        fieldName: 'languageUuid',
        operation: 'EQ',
        value1: this.template.languageUuid,
      },
    ];

    if (this.template?.subCategoryId) {
      filters.push({
        fieldName: 'subCategoryId',
        operation: 'EQ',
        value1: this.template.subCategoryId.toString(),
      });
    }

    if (this.template?.categoryId) {
      filters.push({
        fieldName: 'categoryId',
        operation: 'EQ',
        value1: this.template?.categoryId?.toString(),
      });
    }

    if (this.template.nonSTDTemplateCategory) {
      filters.push({
        fieldName: 'nonSTDTemplateCategory.id',
        operation: 'EQ',
        value1: this.template.nonSTDTemplateCategory.id.toString(),
      });
    }
    let similarTemplates =
      await this.documentCreatorService.getTemplatesByFilters(filters);
    this.isLoading = false;
    if (similarTemplates.length > 0) {
      this.similarTemplates = similarTemplates;
    }

    this.showPublishConfirmation = true;
  }

  async publishTemplate() {
    this.showPublishConfirmation = false;

    if (this.similarTemplates.length > 0) {
      await this.archivePreviousTemplates();
    }
    this.initTask(PublishTasks.PUBLISHING_TEMPLATE);
    let res = await this.editorService.publishTemplate(this.templateUuid);
    if (!res) {
      this.dialogRef.close({
        success: false,
        message: 'Error while publishing template',
      });
    } else {
      this.dialogRef.close({
        success: true,
        message: 'Template published successfully',
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  async archivePreviousTemplates() {
    this.initTask(PublishTasks.ARCHIVING_PREVIOUS_TEMPLATES);

    for (let template of this.similarTemplates) {
      let res = await this.editorService.archiveTemplate(template.uuid);
      if (!res) {
        console.error('Error while archiving template: ' + template.uuid);
      }
    }
    this.isLoading = false;
  }
}
