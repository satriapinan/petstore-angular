import { environment } from '../../../environments/environment';

export const API = {
  STORE: {
    INVENTORY: `${environment.apiUrl}/store/inventory`,
  },

  PET: {
    FIND_BY_STATUS: `${environment.apiUrl}/pet/findByStatus`,
    GET: `${environment.apiUrl}/pet`,
    CREATE: `${environment.apiUrl}/pet`,
    UPDATE: `${environment.apiUrl}/pet`,
    DELETE: `${environment.apiUrl}/pet`,
  },

  USER: {
    LOGIN: `${environment.apiUrl}/user/login`,
    CREATE: `${environment.apiUrl}/user`,
    GET: `${environment.apiUrl}/user`,
  },
};
