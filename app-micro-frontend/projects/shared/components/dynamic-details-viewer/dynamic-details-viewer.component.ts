import { Component, Input, OnInit } from '@angular/core';
import { AttachmentService } from '../../../services/attachment.service';
import { NgClass } from '@angular/common';


export interface DynamicDetailsViewDataGroup {
  title: string;
  items: DynamicDetailsViewDataItem[];
}

export type DynamicDetailsViewValueTypes =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'array'
  | 'file'
  | 'object';

export interface DynamicDetailsViewDataItem {
  label: string;
  value: any;
  valueType?: DynamicDetailsViewValueTypes;
}

@Component({
	selector: 'app-dynamic-details-viewer',
	templateUrl: './dynamic-details-viewer.component.html',
	standalone: true,
	imports: [NgClass],
})
export class DynamicDetailsViewerComponent implements OnInit {
	@Input() additionalDetails: any;
	@Input() showBorder: boolean = false;

	@Input() groupedDetails: DynamicDetailsViewDataGroup[];
	constructor(private attachmentService: AttachmentService) {}

	ngOnInit(): void {}

	ngOnChanges(): void {
		if (this.additionalDetails) {
			this.convertAdditionalDetailsToGroupedDetails(this.additionalDetails);
		}
	}

	convertAdditionalDetailsToGroupedDetails(
		input: Record<string, any>,
	): DynamicDetailsViewDataGroup[] {
		return Object.entries(input).map(([groupTitle, groupContents]) => {
			const items: DynamicDetailsViewDataItem[] = Object.entries(
				groupContents,
			).map(([label, value]) => {
				let valueType: DynamicDetailsViewValueTypes;
				// Determine the type of the value for valueType
				if (typeof value === 'string') {
					valueType = value.match(/^\d{4}-\d{2}-\d{2}$/) ? 'date' : 'string';
				} else if (typeof value === 'number') {
					valueType = 'number';
				} else if (typeof value === 'boolean') {
					valueType = 'boolean';
				} else if (Array.isArray(value)) {
					valueType = 'array';
				} else if (typeof value === 'object') {
					valueType = 'object';
				} else {
					valueType = 'string'; // Default to string if type is unknown
				}

				return { label, value, valueType };
			});

			return {
				title: groupTitle,
				items,
			};
		});
	}

	viewFile(uuid: string) {
		this.attachmentService.viewFileByUuidWithLoader(uuid);
	}
}
