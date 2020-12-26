import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { charactersService } from '../characters.service';
import { AuthService } from '../../../auth/auth.service';
import { Subscription } from 'rxjs';
import { character } from '../character.model';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'ngx-character-filter',
  templateUrl: './character-filter.component.html',
  styleUrls: ['./character-filter.component.scss']
})
export class CharacterFilterComponent implements OnInit, OnDestroy {

  Characters: character[];

  getAllCharSup: Subscription = new Subscription();
  deleteCharSup: Subscription = new Subscription();

  error: string;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;




  constructor(private charactersService: charactersService, private authService: AuthService, private router: Router,private dbService: NgxIndexedDBService
) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;

    this.onEdit = this.onEdit.bind(this);

    this.orderHeaderFilter = this.orderHeaderFilter.bind(this);
  }

  ngOnInit() {
    this.getAllCharSup = this.charactersService.characterFilter().subscribe(
      (data: character[]) => {
        // console.log(data);
        this.Characters = data
      },
      error => this.error = error
    )

  }
  private static getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }

  calculateFilterExpression(value, selectedFilterOperations, target) {
    let column = this as any;
    if (target === "headerFilter" && value === "weekends") {
      return [[CharacterFilterComponent.getOrderDay, "=", 0], "or", [CharacterFilterComponent.getOrderDay, "=", 6]];
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
    return !CharacterFilterComponent.isChief(e.row.data.Position);
  }
  onSelectRow(e) {
    // console.log(e.data)
    this.router.navigate(['pages/allocation/allocation-scene/' + e.data.id])
  }
  onRowRemoved(e) {
    try{
      this.deleteCharSup = this.charactersService.characterDelete(e.data.id).subscribe(res => {
       
      })
    } catch (e) {
       }
       let characterName = e.data.url.replace("/file-transfer-service/characters/", "").replace(".glb", "");
       console.log(characterName)
       this.dbService.delete("characters", characterName)

  }
  onEdit(e) {
    //console.log(e.row.data)
    this.router.navigate(['pages/characters/character-edit/' + e.row.data.id])

  }

  onAddCharacter() {
    this.router.navigate(['pages/characters/character-create/'])
  }



  ngOnDestroy() {
    this.getAllCharSup.unsubscribe();
    this.deleteCharSup.unsubscribe();
  }
}
