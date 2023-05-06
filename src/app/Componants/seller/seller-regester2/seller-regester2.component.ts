import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from 'src/app/Services/user/user-auth.service';

@Component({
  selector: 'app-seller-regester2',
  templateUrl: './seller-regester2.component.html',
  styleUrls: ['./seller-regester2.component.scss']
})
export class SellerRegester2Component {

  sellerInputs: FormGroup

  constructor(public fb: FormBuilder, private authService: UserAuthService, private router: Router, private toastr: ToastrService) {

    this.sellerInputs = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      shopName: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })

  }


  sellerSignUp() {
    let sellerData = {
      name: this.sellerInputs.controls['name'].value,
      email: this.sellerInputs.controls['email'].value,
      phone: this.sellerInputs.controls['phone'].value,
      password: this.sellerInputs.controls['password'].value,
      isAdmin: false,
      isSeller: true,
      shopName: this.sellerInputs.controls['shopName'].value,
      description: this.sellerInputs.controls['description'].value
    }
    this.authService.sellerSignup(sellerData).subscribe(data => {

      this.toastr.success(`${sellerData.name}, Your're Signup Successfully As a Seller..`);
      this.router.navigate(["/"])

    }, (err) => {
      this.toastr.error(err);

    })
  }

}
