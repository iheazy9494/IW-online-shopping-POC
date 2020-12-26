import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <!-- 
    <div class="socials">
       <a href="#" target="_blank" class="ion ion-social-github"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
     <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
     </div>-->
    <h5 style="font-weight:600;" class="text-center mx-auto"> <small>&copy; Copyright 2020, IdealWaves</small></h5>
  `,
})
export class FooterComponent {
}
// <span class="created-by">Created with ♥ by <b><a href="https://akveo.com" target="_blank">Akveo</a></b> 2019</span>