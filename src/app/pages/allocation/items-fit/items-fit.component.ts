import { Items } from './../../items/items.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { ItemsService } from './../../items/items.service';
import { character } from './../../characters/character.model';
import { EngineService } from './../../../threejs-service/threejs.service';
import { charactersService } from './../../characters/characters.service';
import { Component, OnInit } from '@angular/core';
import { AllocationService } from '../allocation.service';
import { Subscription } from 'rxjs';
import { Params, ActivatedRoute, Router } from '@angular/router';
import * as THREE from 'three';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-items-fit',
  templateUrl: './items-fit.component.html',
  styleUrls: ['./items-fit.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 }))
      ])
    ]
    )
  ]
})
export class ItemsFitComponent implements OnInit {

  routSub: Subscription = new Subscription();
  getFitItemsSub: Subscription = new Subscription();
  getOneItemSup: Subscription = new Subscription();
  characterLoadedSub: Subscription = new Subscription();
  itemLoadedSub: Subscription = new Subscription();
  characterUrlFileSub: Subscription = new Subscription();
  runAnimationSup: Subscription = new Subscription();

  characterId;
  charType;
  ItemFitArr = [];

  itemType = null;
  itemSubtype1 = null;
  itemColor = null;
  shoesSize = null;
  bagSize = null;
  itemSubTypeArr = [];
  shoseSize = [];

  apiUrl;
  characterLoaded;
  alertcharacterLoaded;
  itemLoaded;

  characterName:string;
  runAnimation  = false;

  constructor(private route: ActivatedRoute, private AllocationService: AllocationService, private charactersService: charactersService, private engServ: EngineService, private ItemsService: ItemsService,
    private router: Router) { }

  ngOnInit() {

    this.alertcharacterLoaded = true;

    this.apiUrl = environment.apiUrl;
    if (this.route.params) {
      this.routSub = this.route.params
        .subscribe((prams: Params) => {
          this.characterId = +prams['id']; //add + to convert string id to number
        });
    }
    if (this.characterId) {
      this.characterLoaded = false;
      this.itemLoaded = false;
      this.characterLoadedSub = this.AllocationService.characterLoadedSuc.subscribe(res => {
        if (res == true) {
          this.characterLoaded = true;
          this.itemLoaded = false;
        }

      });
      this.alertcharacterLoaded = false;
      setTimeout(() => {
        this.alertcharacterLoaded = true;
      }, 3000);
      this.getFitItemsSub = this.AllocationService.getFitItems({ character_id: this.characterId }).subscribe(res => {
       // console.log(res)
        this.ItemFitArr = res;
      });

      this.getOneItemSup = this.charactersService.getOneCharacter(this.characterId).subscribe((res: character) => {
        this.charType = res.characterType;


        if (this.charType === "Adult Male" || this.charType === "Teen Male") {
          this.shoseSize = [6, 7, 7.5, 8, 8.5, 9, 10.5, 11.5, 12, 13, 14]
        } else if (this.charType === "Adult Female" || this.charType === "Teen Female") {
          this.shoseSize = [5, 6, 6.5, 7.5, 8.5, 9, 9.5, 10, 10.5]
        } else if (this.charType === "Children Boy" || this.charType === "Children Gilr") {
          this.shoseSize = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13]
        }
        else {
          this.shoseSize = [];
        }
      })
    }


    this.runAnimationSup = this.engServ.runAnimation.subscribe(res =>{
      this.runAnimation = res;
    })

  }


  shirtMode = null;
  jeansMode = null;
  skirtMode = null;


  onLoadItem(item) {

    this.itemLoaded = true;
    this.itemLoadedSub = this.AllocationService.itemLoadedSuc.subscribe(res => {
      if (!res) {
        this.itemLoaded = res;
      }

    });
    
    if (item.threeD.length > 0) {
      this.AllocationService.itemUrlFile.next({itemId:item.id ,itemUrl:item.link + item.threeD[0], itemSubType1:item.subtype1});
    }
   // alert(item.subtype1.toLowerCase())
    this.engServ.scene.traverse((o) =>{
      try{
        if (o.name.includes('shirt') || o.name.includes('wshirt')) {
          this.shirtMode = o.name;
          } 

          if (o.name.includes('jeans') ||o.name.includes('wjeans') ) {
          this.jeansMode = o.name;
         // console.log(this.jeansMode)

          }
          if (o.name.includes('skirt')) {
            this.skirtMode = o.name;
           // console.log(this.skirtMode)
            }
          if (item.subtype1.toLowerCase() === "dress") {
            console.log(item.subtype1)
            if (this.shirtMode != null) {
              let shirtMode = this.engServ.scene.getObjectByName(this.shirtMode);
              this.engServ.scene.remove(shirtMode);
              this.engServ.scene.remove(shirtMode.parent.parent);
              this.shirtMode = null
            } else if (this.jeansMode != null) {
              let jeansMode = this.engServ.scene.getObjectByName(this.jeansMode);
              this.engServ.scene.remove(jeansMode);
              this.engServ.scene.remove(jeansMode.parent.parent);
              this.jeansMode = null
            }else if (this.skirtMode != null) {
              let skirtMode = this.engServ.scene.getObjectByName(this.skirtMode);
              this.engServ.scene.remove(skirtMode);
              this.engServ.scene.remove(skirtMode.parent.parent);
              this.skirtMode = null
            }

            if (this.jeansMode != null && this.shirtMode != null && this.skirtMode != null) {
              let shirtMode = this.engServ.scene.getObjectByName(this.shirtMode);
              this.engServ.scene.remove(shirtMode);
              this.engServ.scene.remove(shirtMode.parent.parent);
              let jeansMode = this.engServ.scene.getObjectByName(this.jeansMode);
              this.engServ.scene.remove(jeansMode);
              this.engServ.scene.remove(jeansMode.parent.parent);
              let skirtMode = this.engServ.scene.getObjectByName(this.skirtMode);
              this.engServ.scene.remove(skirtMode);
              this.engServ.scene.remove(skirtMode.parent.parent);
              this.shirtMode = this.jeansMode = this.skirtMode =null 
            }
          } else if (item.subtype1.replace("-", "").toLowerCase() === "shirt" || item.subtype1.replace("-", "").toLowerCase() === "wshirt" || item.subtype1.replace("-", "").toLowerCase() === "jeans" || item.subtype1.replace("-", "").toLowerCase() === "wjeans"  || item.subtype1.replace("-", "").toLowerCase() === "skirt") {
            if (o.name.includes('dress')) {
              let selectedObject = this.engServ.scene.getObjectByName(o.name);
              this.engServ.scene.remove(selectedObject);
              this.engServ.scene.remove(selectedObject.parent.parent);
            }
          }

      if (item.subtype1.toLowerCase() === "skirt" || item.subtype1.toLowerCase() === "jeans" || item.subtype1.toLowerCase() === "wjeans") {
      // console.log(true)

        if (this.jeansMode != null) {
          let jeansMode = this.engServ.scene.getObjectByName(this.jeansMode);
          this.engServ.scene.remove(jeansMode);
          this.engServ.scene.remove(jeansMode.parent.parent);
          this.jeansMode = null
        }else if (this.skirtMode != null) {
          let skirtMode = this.engServ.scene.getObjectByName(this.skirtMode);
          this.engServ.scene.remove(skirtMode);
          this.engServ.scene.remove(skirtMode.parent.parent);
          this.skirtMode = null
        }
      }

      }catch(e){}
    })
   // this.engServ.render()

  }

 

  onInfo(item) {
    this.router.navigate(['pages/items/item-edit/' + item.id]);
  }
  AccessoriesMode = false;

  onItemTypeChange(event) {
    this.itemType = event.name;
    this.shoesMode = false;
    this.bagMode = false;
    this.itemSubtype1 = null;
    if (this.itemType === 'All') {
      this.itemType = null;
      this.itemSubTypeArr = null;
      this.bagSize = null;
      this.shoesSize = null;
      this.itemSubtype1 = null;
    } else {
      this.itemSubTypeArr = this.ItemsService.ItemSubTypes[this.charType][this.itemType]
    }
    if (this.itemType === "Accessories") {
      this.AccessoriesMode = true;
    } else {
      this.AccessoriesMode = false;
      this.bagSize = null;
      this.shoesSize = null;
      this.itemSubtype1 = null;
    }


  }
  shoesMode = false;
  bagMode = false;
  onItemSubTypeChange(event) {
    this.itemSubtype1 = event.name;
    if (this.itemSubtype1 === 'All') {
      this.shoesSize = true;
      this.bagMode = true;
      this.bagSize = null;
      this.shoesSize = null;
    } else if (this.itemSubtype1 === "Shoes") {
      this.shoesMode = true;
      this.bagMode = false;
      this.bagSize = null;
    } else if (this.itemSubtype1 === "Bag") {
      this.shoesMode = false;
      this.bagMode = true;
      this.shoesSize = null;
    } else {
      this.shoesMode = false;
      this.bagMode = false;
    }
  }
  onItemColorChange(event) {
    this.itemColor = event.name;
    if (this.itemColor === 'All') {
      this.itemColor = null;
    }
  }
  onshoesChange(event) {
    this.shoesSize = event;
  }
  onBagChange(event) {
    this.bagSize = event.name;
  }
  onItemSearch() {

    this.getFitItemsSub = this.AllocationService.getFitItems(
      {
        character_id: this.characterId,
        type: this.itemType,
        subtype1: this.itemSubtype1,
        color: this.itemColor,
        shoseSize: this.shoesSize,
        bagSize: this.bagSize
      }).subscribe(res => {
        this.ItemFitArr = res;
      })
  }
  ngOnDestroy(): void {
    if (this.routSub) {
      this.routSub.unsubscribe();
    }
    if (this.getFitItemsSub) {
      this.getFitItemsSub.unsubscribe();
    }
    if (this.getOneItemSup) {
      this.getOneItemSup.unsubscribe();
    }
    if (this.characterLoadedSub) {
      this.characterLoadedSub.unsubscribe();
    }
    if(this.characterUrlFileSub) this.characterUrlFileSub.unsubscribe();
    if(this.runAnimationSup)this.runAnimationSup.unsubscribe();

  }
}
