
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();

    let lastClear = JSON.parse(localStorage.getItem('user'))
    let timeNow = new Date().getTime();
    if (lastClear) {
      if (lastClear.expires_in < timeNow) {
        localStorage.removeItem("user");
      }
    }

  }
}
