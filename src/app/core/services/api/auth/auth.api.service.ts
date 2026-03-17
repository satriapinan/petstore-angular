import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../../../shared/constants/api.constants';
import { ApiResponse } from '../../../../shared/models/api-response.model';
import { User } from '../../../../shared/models/user.model';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  login(username: string, password: string): Observable<ApiResponse> {
    return this.get<ApiResponse>(API.USER.LOGIN, { username, password });
  }

  getUser(username: string): Observable<User> {
    return this.get<User>(`${API.USER.GET}/${username}`);
  }

  register(user: User): Observable<User> {
    return this.post<User>(API.USER.CREATE, user);
  }
}
