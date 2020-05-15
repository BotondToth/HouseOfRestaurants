import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Food} from '../model/food.model';
import {Topping} from '../model/topping.model';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  food: Food;
  basket: Food[];
  toppings: Topping[];
  selectedToppings = [];
  price = 0;

  constructor(private dialogRef: MatDialogRef<OrderDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.food = data.food;
    this.basket = data.basket;
    this.toppings = data.toppings;
    this.price = data.price;
  }

  showOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedToppings.push(event.source.id);
    } else {
      const index = this.selectedToppings.indexOf(event.source.id);
      // tslint:disable-next-line:no-unused-expression
      index !== -1 && delete this.selectedToppings[index];
    }
  }

  ngOnInit(): void {
  }

  order() {
    if (this.basket.length >= 4) {
      alert('Egyszerre csak 4 terméket rendelhetsz!');
      return;
    }
    this.food.extras = this.selectedToppings.filter(t => t != null);
    this.basket.push(this.food);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
