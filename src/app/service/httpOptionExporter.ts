import {HttpHeaders} from '@angular/common/http';

export const httpOptionHeader = () => {
  return {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
};
