import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegester2Component } from './seller-regester2.component';

describe('SellerRegester2Component', () => {
  let component: SellerRegester2Component;
  let fixture: ComponentFixture<SellerRegester2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerRegester2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerRegester2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
