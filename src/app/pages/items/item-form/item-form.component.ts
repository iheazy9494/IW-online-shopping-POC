import { Subscription } from 'rxjs';

import { ItemsService } from './../items.service';
import { Items } from './../items.model';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'ngx-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit, OnDestroy {
  error: string;
  @ViewChild('f', { static: false }) ItemForm: NgForm;

  getOneItemSup: Subscription = new Subscription();
  addItemSup: Subscription = new Subscription();
  updateOneItemSup: Subscription = new Subscription();
  routSub: Subscription = new Subscription();
  copyItemSub: Subscription = new Subscription();

  itemObj: Items;
  updateSuccess = false;

  selectedGenderFit = null;
  selectedItemType = null;
  selectedItemSubType = null;
  GenderFit;
  itemSize;
  selectedItemSubTypes = false;
  itemCharacterFormArr = false;
  selectedSize = false;

  ItemSubType;
  ItemId;
  editMode = false;

  shoulderToFeet = [];
  shoulderToUnderKnee = [];
  shoulderToAboveKnee = [];
  shoulderToHeel = [];
  shoulderToHip = [];
  shoseSize = []
  leg = [];
  sleeve = [];
  chest = [];
  waist = [];
  neck = [];
  hip = [];

  constructor(
    private ItemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.setunit(this.shoulderToFeet, 50, 200, 0.5);
    this.setunit(this.shoulderToUnderKnee, 50, 170, 0.5);
    this.setunit(this.shoulderToAboveKnee, 50, 170, 0.5);
    this.setunit(this.shoulderToHeel, 10, 190, 0.5);
    this.setunit(this.shoulderToHip, 10, 130, 0.5);
    this.setunit(this.chest, 10, 160, 0.5);
    this.setunit(this.waist, 10, 160, 0.5);
    this.setunit(this.neck, 5, 50, 0.5);
    this.setunit(this.leg, 50, 160, 0.5);
    this.setunit(this.sleeve, 5, 110, 0.5);
    this.setunit(this.hip, 10, 150, 0.5);

    this.itemSize = this.ItemsService.itemSize;

    if (this.route.params) {
      this.routSub = this.route.params
        .subscribe((prams: Params) => {
          this.ItemId = +prams['id'];
          this.editMode = prams['id'] != null;
        });
    }

    this.ItemSubType = null;

    if (this.editMode) {

      this.getOneItemSup = this.ItemsService.getOneItem(this.ItemId).subscribe((res: Items) => {
        if (res.subtype1 === 'T-Shirt' || res.subtype1 === 'Shirt'|| res.subtype1 === 'Skirt' || res.subtype1 === 'Jacket' || res.subtype1 === 'Jeans' || res.subtype1 === 'Dress') {
          this.shoesMode = true;
          this.bagsMode = true;
          this.itemSubTypeMode = false;
          if (res.subtype1 === 'T-Shirt' || res.subtype1 === 'Shirt' || res.subtype1 === 'Jacket') {
            this.tshirtMode = false;
            this.jacketMode = false;
            this.trouserMode = true;
            this.DressMode = true;
          } else if (res.subtype1 === 'Jeans') {
            this.tshirtMode = true;
            this.jacketMode = true;
            this.trouserMode = false;
            this.DressMode = true;
          } else if (res.subtype1 === 'Dress') {
            this.tshirtMode = true;
            this.jacketMode = true;
            this.trouserMode = true;
            this.DressMode = false;
          } else if (res.subtype1 === 'Skirt') {
            this.tshirtMode = true;
            this.jacketMode = true;
            this.trouserMode = false;
            this.DressMode = true;
          }
        } else {
          this.itemSubTypeMode = true;
        }
        if (res.subtype1 === 'Shoes' || res.subtype1 === 'Bag' || res.subtype1 === 'Cap' || res.subtype1 === 'Hijab') {
          this.exeptAccess = false;
          if (res.subtype1 === 'Shoes') {
            this.shoesMode = true;
            this.bagsMode = false;
          }
          if (res.subtype1 === 'Bag' || res.subtype1 === 'Cap' || res.subtype1 === 'Hijab') {
            this.bagsMode = true;
            this.shoesMode = false;
          }
        } else {
          this.exeptAccess = true;
        }

        if (res.genderFit === "Adult Male" || res.genderFit === "Teen Male") {
          this.shoseSize = [6, 7, 7.5, 8, 8.5, 9, 10.5, 11.5, 12, 13, 14]
        } else if (res.genderFit === "Adult Female" || res.genderFit === "Teen Female") {
          this.shoseSize = [5, 6, 6.5, 7.5, 8.5, 9, 9.5, 10, 10.5]
        } else if (res.genderFit === "Children Boy" || res.genderFit === "Children Gilr") {
          this.shoseSize = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13]
        }
        else {
          this.shoseSize = [];
        }

        this.GenderFit = this.ItemsService.charType[res.genderType];
        this.selectedItemType = res.type;
        this.selectedItemSubTypes = this.ItemsService.ItemSubTypes[res.genderFit][res.type];
        this.itemCharacterFormArr = this.ItemsService.itemCharacterForm[res.genderFit]
        
        if (res.sizeUnit != null) {
          this.selectedSize = this.ItemsService.itemSize[res.sizeUnit][res.subtype1];
        }

        this.ItemSubType = res.subtype1;
        this.itemObj = res;

        this.ItemForm.setValue({
          sn: res.sn,
          name: res.name,
          genderType: res.genderType,
          genderFit: res.genderFit,
          type: res.type,
          subtype1: res.subtype1,
          cutStyle: res.cutStyle,
          color: res.color,
          brand: res.brand,
          sizeUnit: res.sizeUnit,
          size: res.size,
          shoulderToFeet: res.shoulderToFeet,
          shoulderToUnderKnee: res.shoulderToUnderKnee,
          shoulderToAboveKnee: res.shoulderToAboveKnee,
          shoulderToHeel: res.shoulderToHeel,
          shoulderToHip: res.shoulderToHip,
          chest: res.chest,
          waist: res.waist,
          neck: res.neck,
          leg: res.leg,
          sleeve: res.sleeve,
          hip: res.hip,
          shoseSize: res.shoseSize,
          bagSize: res.bagSize,
          itemBodyForm:res.itemBodyForm
        })

      }, error => this.error = error)

    }


  }

  setunit(arr, min: number, max: number, increase) {
    for (let i = min; i <= max; i += increase) {
      arr.push({ name: i })
    }
  }
  onGenderChange(event) {
    this.selectedGenderFit = this.selectedItemSubType = null;
    this.selectedItemSubTypes = false;
    this.GenderFit = this.ItemsService.charType[event.name];

    //show shoulder to(feet,under knee, above knee, heel)
    this.itemSubTypeMode = true;
    this.itemSubTypeMode = true;
    this.tshirtMode = true;
    this.jacketMode = true;
    this.trouserMode = true;
    this.DressMode = true;

  }

  onGenderFit(event) {
    this.selectedItemSubType = null;
    this.selectedGenderFit = event.name;
    this.selectedItemSubTypes = this.ItemsService.ItemSubTypes[this.selectedGenderFit][this.selectedItemType];

    if (this.selectedGenderFit === "Adult Male" || this.selectedGenderFit === "Teen Male") {
      this.shoseSize = [6, 7, 7.5, 8, 8.5, 9, 10.5, 11.5, 12, 13, 14]
    } else if (this.selectedGenderFit === "Adult Female" || this.selectedGenderFit === "Teen Female") {
      this.shoseSize = [5, 6, 6.5, 7.5, 8.5, 9, 9.5, 10, 10.5]
    } else if (this.selectedGenderFit === "Children Boy" || this.selectedGenderFit === "Children Girl") {
      this.shoseSize = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13]
    }
    else {
      this.shoseSize = [];
    }

    this.itemCharacterFormArr = this.ItemsService.itemCharacterForm[event.name]
  }

  onItemTypeChange(event) {
    if (this.selectedGenderFit === "Adult Male" || this.selectedGenderFit === "Teen Male") {
      this.shoseSize = [6, 7, 7.5, 8, 8.5, 9, 10.5, 11.5, 12, 13, 14]
    } else if (this.selectedGenderFit === "Adult Female" || this.selectedGenderFit === "Teen Female") {
      this.shoseSize = [5, 6, 6.5, 7.5, 8.5, 9, 9.5, 10, 10.5]
    } else if (this.selectedGenderFit === "Children Boy" || this.selectedGenderFit === "Children Girl") {
      this.shoseSize = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13]
    }
    else {
      this.shoseSize = [];
    }
    this.selectedGenderFit
    this.selectedItemSubType = null;
    this.selectedItemType = event.name;
    this.selectedItemSubTypes = this.ItemsService.ItemSubTypes[this.selectedGenderFit][this.selectedItemType];

  }


  itemSubTypeMode = true;
  tshirtMode = true;
  jacketMode = true;
  trouserMode = true;
  DressMode = true;
  shoesMode = true;
  bagsMode = true;
  exeptAccess = true;
  onItemsubType(event) {
    // alert(this.selectedGenderFit)
    this.ItemSubType = event.name;
    if (event.name === 'T-Shirt' || event.name === 'Shirt' || event.name === 'Jacket' || event.name === 'Jeans' ||event.name === 'Skirt' || event.name === 'Dress') {
      this.shoesMode = true;
      this.bagsMode = true;
      this.itemSubTypeMode = false;
      if (event.name === 'T-Shirt' || event.name === 'Jacket') {
        this.tshirtMode = false;
        this.jacketMode = false;
        this.trouserMode = true;
        this.DressMode = true;
      } else if (event.name === 'Jeans') {
        this.tshirtMode = true;
        this.jacketMode = true;
        this.trouserMode = false;
        this.DressMode = true;
      }  else if (event.name === 'Skirt') {
        this.tshirtMode = true;
        this.jacketMode = true;
        this.trouserMode = false;
        this.DressMode = true;
      } else if (event.name === 'Dress') {
        this.tshirtMode = true;
        this.jacketMode = true;
        this.trouserMode = true;
        this.DressMode = false;
      }
    } else {
      this.itemSubTypeMode = true;
    }
    if (event.name === 'Shoes' || event.name === 'Bag' || event.name === 'Cap' || event.name === 'Hijab') {
      this.exeptAccess = false;
      if (event.name === 'Shoes') {
        this.shoesMode = true;
        this.bagsMode = false;
      }
      if (event.name === 'Bag' || event.name === 'Cap' || event.name === 'Hijab') {
        this.shoesMode = false;
        this.bagsMode = true;
      }
    } else {
      this.exeptAccess = true;
    }
  }
  onSizeUnit(event) {
    this.selectedSize = this.ItemsService.itemSize[event.name][this.ItemSubType];
  }

  onSubmit(f: NgForm) {
    const value = f.value;
    if (this.editMode) {
      const updateItem = new Items(
        value.sn,
        value.name,
        value.genderType,
        value.genderFit,
        value.type,
        value.subtype1,
        value.cutStyle,
        value.color,
        value.brand,
        value.sizeUnit,
        value.size,
        value.shoulderToFeet,
        value.shoulderToUnderKnee,
        value.shoulderToAboveKnee,
        value.shoulderToHeel,
        value.shoulderToHip,
        value.chest,
        value.waist,
        value.neck,
        value.leg,
        value.sleeve,
        value.hip,
        value.shoseSize,
        value.bagSize,
        value.itemBodyForm,
        this.ItemId
      );

      if (
        updateItem.sn === this.itemObj.sn &&
        updateItem.name === this.itemObj.name &&
        updateItem.genderType === this.itemObj.genderType &&
        updateItem.genderFit === this.itemObj.genderFit &&
        updateItem.type === this.itemObj.type &&
        updateItem.subtype1 === this.itemObj.subtype1 &&
        updateItem.cutStyle === this.itemObj.cutStyle &&
        updateItem.color === this.itemObj.color &&
        updateItem.brand === this.itemObj.brand &&
        updateItem.sizeUnit === this.itemObj.sizeUnit &&
        updateItem.size === this.itemObj.size &&
        updateItem.shoulderToFeet === this.itemObj.shoulderToFeet &&
        updateItem.shoulderToUnderKnee === this.itemObj.shoulderToUnderKnee &&
        updateItem.shoulderToAboveKnee === this.itemObj.shoulderToAboveKnee &&
        updateItem.shoulderToHeel === this.itemObj.shoulderToHeel &&
        updateItem.shoulderToHip === this.itemObj.shoulderToHip &&
        updateItem.chest === this.itemObj.chest &&
        updateItem.waist === this.itemObj.waist &&
        updateItem.neck === this.itemObj.neck &&
        updateItem.leg === this.itemObj.leg &&
        updateItem.sleeve === this.itemObj.sleeve &&
        updateItem.hip === this.itemObj.hip &&
        updateItem.shoseSize === this.itemObj.shoseSize &&
        updateItem.bagSize === this.itemObj.bagSize &&
        updateItem.itemBodyForm === this.itemObj.itemBodyForm
      ) {


      } else {

        this.updateOneItemSup = this.ItemsService.updateOneItem( updateItem).subscribe(res => {
          this.updateSuccess = true;
          setTimeout(() => {
            this.updateSuccess = false;
          }, 2000);
        }, error => console.log(error));
      }
    } else {
      const newItem = new Items(
        value.sn,
        value.name,
        value.genderType,
        value.genderFit,
        value.type,
        value.subtype1,
        value.cutStyle,
        value.color,
        value.brand,
        value.sizeUnit,
        value.size,
        value.shoulderToFeet,
        value.shoulderToUnderKnee,
        value.shoulderToAboveKnee,
        value.shoulderToHeel,
        value.shoulderToHip,
        value.chest,
        value.waist,
        value.neck,
        value.leg,
        value.sleeve,
        value.hip,
        value.shoseSize,
        value.bagSize,
        value.itemBodyForm,
      );

      this.addItemSup = this.ItemsService.addItem(newItem).subscribe(newItem => {
        this.ItemId = newItem['id'];
        this.router.navigate(['pages/items/item-edit/', this.ItemId]);
        this.compyMode = true;
        f.reset();
      }, error => this.error = error)

    }
    this.itemObj = value;
  }


  compyMode = false;
  onCopyItem() {
    this.addItemSup = this.ItemsService.addItem(this.ItemForm.value).subscribe(res => {
      this.copyItemSub = this.ItemsService.copyItem(res['id'], this.ItemId).subscribe(res2 => {
        this.router.navigate(['pages/items/item-edit/', res['id']]);
        this.compyMode = true;
      }, error => this.error = error)
    }, error => this.error = error);
    setTimeout(() => {
      this.compyMode = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.getOneItemSup.unsubscribe();
    this.addItemSup.unsubscribe();
    this.updateOneItemSup.unsubscribe();
    this.copyItemSub.unsubscribe();
  }
}
