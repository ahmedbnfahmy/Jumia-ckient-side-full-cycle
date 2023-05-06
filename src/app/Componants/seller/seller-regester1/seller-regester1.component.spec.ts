import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegester1Component } from './seller-regester1.component';

describe('SellerRegester1Component', () => {
  let component: SellerRegester1Component;
  let fixture: ComponentFixture<SellerRegester1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerRegester1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerRegester1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
