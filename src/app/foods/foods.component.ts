import {Component, OnInit} from '@angular/core';
import {FoodsService} from '../service/foods/foods.service';
import {Food} from '../model/food.model';
import {LoginService} from '../service/login/login.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OrderDetailsComponent} from '../order-details/order-details.component';
import {Topping} from '../model/topping.model';
import {Order} from '../model/order.model';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {

  foods: Food[];
  allFoods: Food[];
  basket: Food[] = [];
  toppings: Topping[] = [];
  processedOrders: Order[] = [];

  constructor(private router: Router,
              private foodsService: FoodsService,
              private loginService: LoginService,
              private dialog: MatDialog) {
    this.getFoods();
    this.getToppings();
    this.getProcessedOrders();
    this.observeOrders();
  }

  observeOrders = () => {
    setInterval(() => { this.getProcessedOrders(); }, 10000);
  }

  ngOnInit(): void {}


  getProcessedOrders = () => {
    this.foodsService.getProcessedOrders().subscribe(res => {
      // @ts-ignore
      if (res.statusCode === 200) {
        this.processedOrders = res.processedOrders.filter(f => f.status !== 8);
        console.log('processed orders on FE: ', this.processedOrders);
      } else {
        console.log('error while fetching processed orders from backend');
      }
    });
  }

  getStatusOfOrder = status => {
    switch (status) {
      case 0:
        return 'Feldolgozás alatt';
      case 1:
        return 'Hozzávalók kimérése...';
      case 2:
        return 'Sütő bemelegítése...';
      case 3:
        return 'Tészta gyúrása...';
      case 4:
        return 'Feltétek felhelyezése...';
      case 5:
        return 'Sütés...';
      case 6:
        return 'Csomagolás...';
      case 7:
        return 'Futárnak átadva!';
      case 8:
        return 'Teljesítve!';
    }
  }

  getFoods = () => {
    this.foodsService.getFoods().subscribe(res => {
      // @ts-ignore
      if (res.statusCode === 200) {
        this.allFoods = res.foods;
        this.foods = res.foods;
        console.log('all food on FE: ', this.allFoods);
      } else {
        console.log('error while fetching foods from backend');
      }
    });
  }

  getToppings = () => {
    this.foodsService.getToppings().subscribe(res => {
      // @ts-ignore
      if (res.statusCode === 200) {
        this.toppings = res.toppings;
        console.log('all toppings on FE: ', this.toppings);
      } else {
        console.log('error while fetching toppings from backend');
      }
    });
  }

  filterFood = (foodType: string) => {
    this.foods = this.allFoods.filter(food => food.type === foodType);
  }

  getAll = () => {
    this.foods = this.allFoods;
  }

  openDetailsModal = (order: Order) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {order};
    this.dialog.open(OrderDetailsComponent, dialogConfig);
  }

  onBasketClick = (food: Food) => {
    const dialogConfig = new MatDialogConfig();
    const basket = this.basket;
    const toppings = this.toppings;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {food, basket, toppings};
    this.dialog.open(OrderDetailsComponent, dialogConfig);
  }

  order = () => {
    const orderObj = {
      order: []
    };
    if (this.basket.length > 0) {
      this.basket.forEach(food => {
        const foodObj = { food: food._id, extra: food.extras};
        orderObj.order.push(foodObj);
      });
      this.foodsService.order(orderObj).subscribe(res => {
        if (res.statusCode === 200) {
          alert('Köszönjük a rendelést!');
        } else {
          alert('Hiba történt, kérlek próbáld újra!');
        }
      });
    }
    this.getProcessedOrders();
    this.basket = [];
  }

  emptyBasket = () => {
    this.basket.length = 0;
  }


  logOut = () => {
    this.loginService.logOut().subscribe(res => {
      // @ts-ignore
      if (res.statusCode === 200) {
        this.router.navigate(['/']);
      } else {
        alert('Error during logout');
      }
    });
  }
}
