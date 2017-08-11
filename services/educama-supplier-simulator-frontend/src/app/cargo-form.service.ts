import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CargoForm } from './cargo-form';

@Injectable()
export class CargoFormService {
  private url = 'https://educama-supplier-simulator-backend-sandbox.mybluemix.net/api/haulierbooking';

  constructor(private http: Http) { }

  sendEvent(event: CargoForm): Observable<any> {
    return this.http.post(this.url, event).map(res => res.json());
  }

}
