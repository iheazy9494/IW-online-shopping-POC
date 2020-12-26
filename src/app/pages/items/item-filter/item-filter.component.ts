import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Items } from './../items.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table'
import { ItemsService } from '../items.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'ngx-item-filter',
  templateUrl: './item-filter.component.html',
  styleUrls: ['./item-filter.component.scss']
})
export class ItemFilterComponent implements OnInit, OnDestroy {

  error: string;

  getAllItemsSub: Subscription = new Subscription();
  deleteItemSub: Subscription = new Subscription();


  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;


  items: Items[]
  constructor(private ItemsService: ItemsService, private router: Router, private route: ActivatedRoute) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;

    this.onEdit = this.onEdit.bind(this);

    this.orderHeaderFilter = this.orderHeaderFilter.bind(this);
  }

  ngOnInit() {
    this.getAllItemsSub = this.ItemsService.getAllitems().subscribe((res: Items[]) => {
      this.items = res;
    }, error => this.error = error)
  }

  onAddItem() {
    this.router.navigate(['../item-register'], { relativeTo: this.route });
  }

  private static getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }

  calculateFilterExpression(value, selectedFilterOperations, target) {
    let column = this as any;
    if (target === "headerFilter" && value === "weekends") {
      return [[ItemFilterComponent.getOrderDay, "=", 0], "or", [ItemFilterComponent.getOrderDay, "=", 6]];
    }
    return column.defaultCalculateFilterExpression.apply(this, arguments);
  }

  orderHeaderFilter(data) {
    data.dataSource.postProcess = (results) => {
      results.push({
        text: "Weekends",
        value: "weekends"
      });
      return results;
    };
  }

  private static isChief(position) {
    return position && ["CEO", "CMO"].indexOf(position.trim().toUpperCase()) >= 0;
  };

  allowDeleting(e) {
    return !ItemFilterComponent.isChief(e.row.data.Position);
  }
  onSelectRow(e) {
    // this.router.navigate(['pages/allocation/allocation-scene/' + e.data.id])
  }
  onRowRemoved(e) {
    this.deleteItemSub = this.ItemsService.deleteitem(e.data.id).subscribe((res) => {
    }, error => this.error = error)
  }
  onEdit(e) {
    this.router.navigate(['pages/items/item-edit/' + e.row.data.id])
  }


  ngOnDestroy(): void {
    this.getAllItemsSub.unsubscribe();
    this.deleteItemSub.unsubscribe();
  }
}
