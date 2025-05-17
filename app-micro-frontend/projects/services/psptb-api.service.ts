import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PsptbApiService {
	private readonly url =
		environment.AUTH_URL + '/nest-api/api/psptb-ors/member-info';

	constructor(private http: HttpClient) {}

	getUserByRegNumber(regNumber: string): Observable<any> {
		const payLoad = {
			registrationNumber: regNumber,
		};
		const headers = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
		};
		return this.http.post(this.url, payLoad, headers);
	}
}
