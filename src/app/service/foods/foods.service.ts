import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptionHeader } from '../httpOptionExporter';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {
  constructor(private http: HttpClient) { }

  getProcessedOrders = () => {
    // @ts-ignore
    return this.http.get('http://localhost:3000/orders', httpOptionHeader);
  }

  getFoods = () => {
    // @ts-ignore
    return this.http.get('http://localhost:3000/foods', httpOptionHeader);
  }

  getToppings = () => {
    // @ts-ignore
    return this.http.get('http://localhost:3000/toppings', httpOptionHeader);
  }

  order = (basket: object) => {
    // @ts-ignore
    return this.http.post('http://localhost:3000/order', basket, httpOptionHeader);
  }
}
