import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styles: [`
    * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    }

    .container-login {
              height: 941px;
    }

    .content {
            height: 100%; 
    }

    .loginImg {
              width: 100%;
              height: 100%;
              object-fit: cover;
    }

  `
  ]
})
export class MainPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
