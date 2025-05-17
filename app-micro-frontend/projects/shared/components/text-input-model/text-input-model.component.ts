import { on } from '@ngrx/store';
import { Component, Inject, OnInit } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialogRef,
	MatDialogModule,
} from '@angular/material/dialog';
import {
	UntypedFormGroup,
	UntypedFormBuilder,
	Validators,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

type InputType = 'text' | 'textarea' | 'number' | 'email' | 'password';

export interface SimpleInputModelComponentData {
	title: string;
	inputLabel: string;
	onConfirm: (input: string) => void;
	confirmButtonText: string;
	cancelButtonText: string;
	inputType?: InputType;
	inputValue?: any;
}

@Component({
	selector: 'app-text-input-model',
	templateUrl: './text-input-model.component.html',
	standalone: true,
	imports: [
		MatDialogModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
})
export class TextInputModelComponent implements OnInit {
	title: string;
	message: string;
	allowCancel: boolean = false;
	inputLabel: string;
	onConfirm: (input: string) => void;
	confirmButtonText?: string = 'Ok';
	cancelButtonText?: string = 'Cancel';
	inputType: InputType;
	form: UntypedFormGroup;
	inputValue: any;

	constructor(
		@Inject(MAT_DIALOG_DATA) data: SimpleInputModelComponentData,
		private _dialogRef: MatDialogRef<TextInputModelComponent>,
		private fb: UntypedFormBuilder
	) {
		this.title = data.title;
		this.inputLabel = data.inputLabel;
		this.onConfirm = data.onConfirm;
		this.confirmButtonText = data.confirmButtonText;
		this.cancelButtonText = data.cancelButtonText;
		this.inputType = data.inputType;
		this.inputValue = data.inputValue;
	}
	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.form = this.fb.group({
			inputValue: [null, [Validators.required]],
		});

		if (this.inputValue) {
			this.form.get('inputValue').setValue(this.inputValue);
		}
	}

	confirm() {
		if (this.form.valid) {
			this.onConfirm(this.form.get('inputValue').value);
			this._dialogRef.close();
		}
	}
}
