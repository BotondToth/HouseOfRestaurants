import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersboxComponent } from './ordersbox.component';

describe('OrdersboxComponent', () => {
  let component: OrdersboxComponent;
  let fixture: ComponentFixture<OrdersboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
