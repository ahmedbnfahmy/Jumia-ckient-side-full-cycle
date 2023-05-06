import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Iuser } from 'src/app/Models/iuser';
import { LocalStorgeService } from 'src/app/Services/localStorge/local-storge.service';
import { ProductServicesService } from 'src/app/Services/productservices/product-services.service';
import { AcountuserService } from 'src/app/Services/user/acountuser.service';
import { UserAuthService } from 'src/app/Services/user/user-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartProducts: any;
  subscription!: Subscription;
  len: number = 0
  currentLang: string =localStorage.getItem('current_lang') || 'en';

  loging: string =localStorage.getItem('access_token');

  loged:boolean=false

  User: Iuser = {};
  UserID: any;
  userAddress:any
  data: any;
  userName = ''
  checkPassword: boolean = false;
  checkEmailData: boolean = false;
  public subscriptions: Subscription[] = [];
  constructor(private userAuth:UserAuthService , private prdservice: ProductServicesService,    private storageService:LocalStorgeService,private accountservices:AcountuserService, public translate:TranslateService , private router:Router) {
    this.currentLang = localStorage.getItem('current_lang') || 'en';
    this.translate.use(this.currentLang)
  }
  ngOnInit(): void {
    this.subscription = this.prdservice.getUserCart().subscribe(data => {
      this.cartProducts = data[0];
    })

    this.subscription = this.prdservice.getUserCart().subscribe(data => {
      data[0].items?.length
      this.prdservice.emit<number>(data[0].items?.length);
    })

    this.prdservice.on<number>().subscribe(data => {
      this.len = data
    })

    if(this.loging){
      this.loged=true
    }

    let sub1 = this.userAuth.userName$.subscribe((userName) => {
      const user = JSON.parse(localStorage.getItem('user') as string);
      this.UserID = user._id;
    });

    this.subscriptions.push(sub1);

    let sub2 = this.accountservices.getUserByID(this.UserID).subscribe((user) => {

      this.User = user;
    });

    this.subscriptions.push(sub2);


    this.accountservices.getUserAddByID().subscribe(data=>{
      this.userAddress=data[0]

    })
  }

 

  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('current_lang', lang);
    this.currentLang = lang;
    window.location.reload()

  }

  searchInput(input:string){
    this.router.navigate(["search/"+input])
  }

  logOut(){
    this.userAuth.Logout()
    window.location.reload()

  }

}

