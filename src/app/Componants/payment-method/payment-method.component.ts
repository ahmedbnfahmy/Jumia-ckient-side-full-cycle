import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Icart } from 'src/app/Models/icart';
import { OrderService } from 'src/app/Services/order/order.service';
import { ProductServicesService } from 'src/app/Services/productservices/product-services.service';
import { AcountuserService } from 'src/app/Services/user/acountuser.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {
  paymentForm: FormGroup;
  paynemtHandler: any = null

  success: boolean = false
  failure: boolean = false

  CashOnDelivery = {
    id: 1,
    name: 'Payment',
    value: 'CashOnDelivery',
    label: 'Cash on Delivery (COD) Pay by cash on delivery.. Learn more. Pay online for contactless deliveries.'
    ,
    labelAr: 'الدفع نقدا عند الاستلام ادفع نقدا عند الاستلام.  ادفع عبر الإنترنت للتسليم بدون تلامس.'
  }

  PayPal = {
    id: 2,
    name: 'Payment',
    value: 'Stripe',
    label: 'Stripe',
    labelAr: 'استريب'
  }
  currentLang: string;


  cartProducts: Icart;
  subscription!: Subscription;
  endpoint: any;
  totalPriceCart: number = 0;
  priceWithShipping: number = 50;

  paymentMethod: string = "stripe"

  userAddress: any


  data: any



  constructor(private orderService:OrderService , private accountservices: AcountuserService, private prdservice: ProductServicesService, private fs: FormBuilder, private router: Router) {

    this.currentLang = localStorage.getItem('current_lang') || 'en';

    this.paymentForm = this.fs.group({
      paymentmethod: ['', [Validators.required]]
    })


    this.endpoint = environment.jDBUrl


    this.data = {
      shippingAddress: {
        country: "",
        fullName: "",
        city: "",
        phone: "",
        governate: ""
      },
      paymentmethod: this.paymentMethod,
      shippingPrice: 50,
      taxPrice: null,
      totalPrice: null,
      isPaid:true,
    }

  }
  ngOnInit(): void {
    this.getCard()
    this.invokeStripe()

    this.accountservices.getUserAddByID().subscribe(data => {
      this.userAddress = data[0]

    })

  }


  getCard(): void {
    this.totalPriceCart = 0
    this.subscription = this.prdservice.getUserCart().subscribe(data => {
      this.cartProducts = data[0];
      this.cartProducts?.items?.map((item) => {
        this.totalPriceCart = this.totalPriceCart + (item.productId.price * item.quantity)
        this.priceWithShipping = this.totalPriceCart + 50
      })
    })
  }


  backToCart() {
    this.router.navigate(["/cart"])
  }




  //payment
  makePayment(amount: number) {
    const paynemtHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51MwpKwL91jneEfqmxDgzybtIj4as6QPKXd2R0kRxIGQovhXSzSChRdXJE5nsr21tQgQFGYjFXb227UvWuIhoI0LA00sWiPoUXi',
      locale: 'auto',
      token: function (stripeToken: any) {
        paynemtStripe(stripeToken)
      }
    });
    const paynemtStripe = (stripeToken: any) => {
      // this.checkout.makePayment(stripeToken).subscribe((data:any)=>{

      this.data={
        shippingAddress: {
          country: this.userAddress.country,
          fullName: this.userAddress.fullName,
          city: this.userAddress.city,
          phone: this.userAddress.phone,
          governate: this.userAddress.governate
        },
        paymentmethod: this.paymentMethod,
        shippingPrice: 50,
        taxPrice: amount,
        totalPrice: amount+50,
        isPaid:true,
      }




      let shipPrice = 50
      this.prdservice.addPayment(stripeToken, amount + 50, this.userAddress, shipPrice, this.paymentMethod, amount).subscribe((data: any) => {

        if (data.data === 'success') {
          this.success = true

          this.prdservice.removeCart(this.cartProducts._id).subscribe(data => {
            this.router.navigate(["/cart"])
          })


          this.orderService.addUserOrder(this.data).subscribe()

        } else {
          this.failure = true
        }
      })
    }
    paynemtHandler.open(
      {

        name: 'UserCart',
        description: 'somePrd',
        amount: 5000 + this.totalPriceCart * 100,
        price: this.totalPriceCart

      })
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {

        this.paynemtHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51MwpKwL91jneEfqmxDgzybtIj4as6QPKXd2R0kRxIGQovhXSzSChRdXJE5nsr21tQgQFGYjFXb227UvWuIhoI0LA00sWiPoUXi',
          locale: 'auto',
          token: function (stripeToken: any) {

          }
        })
      }
      window.document.body.appendChild(script);
    }
  }



}

