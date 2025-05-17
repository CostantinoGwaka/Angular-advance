import { Injectable } from '@angular/core';
import { TextConfig, TtextService } from './ttext.service';
import { StorageService } from '../../services/storage.service';

@Injectable({
	providedIn: 'root',
})
export class RemoteLogService {
	private userEmail: string;

	constructor(
		public ttextService: TtextService,
		public storageService: StorageService
	) {}

	public log(
		identifier: string,
		message: string,
		textConfig: TextConfig = null
	): void {
		try {
			this.userEmail = this.storageService.getItem('email');

			let sb = `**${identifier}**\n`;
			if (this.userEmail && this.userEmail.trim() !== '') {
				sb += `User: ${this.userEmail}\n`;
			}
			sb += message;
			if (textConfig) {
				// this.ttextService.sendMessage(sb, TextConfig.TEMPLATE);
			}
		} catch (e: any) {
			console.error('Error while logging error: ' + e.message);
		}
	}
}
