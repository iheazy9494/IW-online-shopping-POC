import { AllocationService } from './../../allocation/allocation.service';
import { character } from './../character.model';
import { charactersService } from './../characters.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { EngineService } from '../../../threejs-service/threejs.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-character-form',
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss']
})
export class CharacterFormComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) characterForm: NgForm;

  errorMessage: any = false;
  error: string;
  characterObj: character;

  selectedCharTypeValue = null;
  selectedAgeValue = null;
  characterId: number;

  editMode = false;
  updateSuccess = false;

  getOneCharSup: Subscription = new Subscription();
  addCharSup: Subscription = new Subscription();
  updateOneCharSup: Subscription = new Subscription();
  routSub: Subscription = new Subscription();
  characterLoadedSucSub: Subscription = new Subscription();
  selectedCharacterType: any = false;
  characterFormArr: any = false;
  Ages = [];
  HeadToFeet = [];
  shoulderToFeet = [];
  shoulderToHeel = [];
  shoulderToHip = [];
  shoulderToUnderKnee = [];
  shoulderToAboveKnee = [];
  leg = [];
  sleeve = [];
  chest = [];
  waist = [];
  neck = [];
  hip = [];

  SkinColor = [
    { id: 2, name: '#ebca9e', avatar: 'assets/colors/skin-color/ffdbac.png', },
    { id: 3, name: '#e1b574', avatar: 'assets/colors/skin-color/f1c27d.png' },
    { id: 4, name: '#ca9b5f', avatar: 'assets/colors/skin-color/e0ac69.png' },
    { id: 5, name: '#ad753a', avatar: 'assets/colors/skin-color/c68642.png' },
    { id: 6, name: '#72451d', avatar: 'assets/colors/skin-color/8d5524.png' },
  ];

  hairColor = [
    { id: 2, name: '#000000', avatar: 'assets/colors/hair-color/000000.png' },
    { id: 3, name: '#583322', avatar: 'assets/colors/hair-color/583322.png' },
    { id: 4, name: '#714721', avatar: 'assets/colors/hair-color/714721.png' },
    { id: 5, name: '#412922', avatar: 'assets/colors/hair-color/412922.png' },
    { id: 6, name: '#7b746e', avatar: 'assets/colors/hair-color/7b746e.png' },
  ];
  eyeColor = [
    { id: 2, name: '#000000', avatar: 'assets/colors/eays-color/black.png' },
    { id: 3, name: '#00ee00', avatar: 'assets/colors/eays-color/green.png' },
    { id: 4, name: '#357388', avatar: 'assets/colors/eays-color/blue.png' },
    { id: 5, name: '#776536', avatar: 'assets/colors/eays-color/hazel.png' },
    { id: 6, name: '#63390f', avatar: 'assets/colors/eays-color/brown.png' },
  ];

  submited;

  constructor(
    private route: ActivatedRoute,
    private charactersService: charactersService,
    private engServ: EngineService,
    private AllocationService: AllocationService, 
    private toastrService: NbToastrService,
    private router: Router
    ) { }

  ngOnInit() {
    this.setunit(this.Ages, 1, 90, 1);
    this.setunit(this.HeadToFeet, 50, 200, 0.5);
    this.setunit(this.shoulderToFeet, 50, 200, 0.5);
    this.setunit(this.shoulderToUnderKnee, 50, 170, 0.5);
    this.setunit(this.shoulderToAboveKnee, 50, 170, 0.5);
    this.setunit(this.shoulderToHeel, 10, 190, 0.5);
    this.setunit(this.shoulderToHip, 10, 130, 0.5);
    this.setunit(this.leg, 10, 130, 0.5);
    this.setunit(this.sleeve, 10, 110, 0.5);
    this.setunit(this.chest, 50, 160, 0.5);
    this.setunit(this.waist, 50, 160, 0.5);
    this.setunit(this.neck, 5, 50, 0.5);
    this.setunit(this.hip, 10, 150, 0.5);

    this.charactersService.characterUrlFile.next(null);
    this.charactersService.characterUrlType.next(null)
    this.charactersService.characterSkinColor.next(null);
    this.charactersService.characterHairColor.next(null);
    this.charactersService.characterEyeColor.next(null);

    this.routSub = this.route.params
      .subscribe((prams: Params) => {
        this.characterId = +prams['id']; //add + to convert string id to number
        this.editMode = prams['id'] != null;
      });
    this.submited = true;
    
    if (this.editMode) {
      this.submited = false;
      this.characterLoadedSucSub = this.AllocationService.characterLoadedSuc.subscribe(res => {
        if (res == true) {
          this.submited = true;
        }

      })

      this.getOneCharSup = this.charactersService.getOneCharacter(this.characterId).subscribe((res: character) => {
        console.log(res)
        this.charactersService.characterUrlFile.next(res['url']);
        this.charactersService.characterUrlType.next(res['urlType'])
        this.charactersService.characterSkinColor.next(res['skinColor']);
        this.charactersService.characterHairColor.next(res['hairColor']);
        this.charactersService.characterEyeColor.next(res['eyeColor']);

        this.characterObj = new character(res.characterName, res.gendar, res.characterType, res.age, res.headToFeet, res.shoulderToFeet, res.shoulderToUnderKnee, res.shoulderToAboveKnee, res.shoulderToHeel,
          res.shoulderToHip, res.leg, res.sleeve, res.chest, res.waist, res.neck, res.hip, res.skinColor, res.hairColor, res.eyeColor,res.bodyForm);

        this.selectedCharacterType = this.charactersService.charType[res.gendar];
        this.characterFormArr = this.charactersService.characterForm[res.characterType];

        this.characterForm.setValue({
          characterName: res.characterName,
          gendar: res.gendar,
          characterType: res.characterType,
          age: res.age,
          headToFeet: res.headToFeet,
          shoulderToFeet: res.shoulderToFeet,
          shoulderToUnderKnee: res.shoulderToUnderKnee,
          shoulderToAboveKnee: res.shoulderToAboveKnee,
          shoulderToHeel: res.shoulderToHeel,
          shoulderToHip: res.shoulderToHip,
          leg: res.leg,
          sleeve: res.sleeve,
          chest: res.chest,
          waist: res.waist,
          neck: res.neck,
          hip: res.hip,
          skinColor: res.skinColor,
          hairColor: res.hairColor,
          eyeColor: res.eyeColor,
          bodyForm:res.bodyForm
        });

      }, error => this.error = error);
    }

  }

  setunit(arr, min: number, max: number, increase) {
    for (let i = min; i <= max; i += increase) {
      arr.push({ name: i })
    }
    return arr;
  }
  onGenderChange(event) {
    this.selectedCharTypeValue = null;
    this.selectedCharacterType = this.charactersService.charType[event.name];
  }
  onCharacterTypeChangeChange(event){
    this.characterFormArr= null;
    this.characterFormArr =  this.charactersService.characterForm[event.name];
  }
  onSubmit(f: NgForm) {

    const value = f.value;

    this.charactersService.characterUrlFile.next(null);
    this.charactersService.characterUrlType.next(null)
    
    if (this.editMode) {

      const updatedCharacter = new character(
        value.characterName,
        value.gendar,
        value.characterType,
        value.age,
        value.headToFeet,
        value.shoulderToFeet,
        value.shoulderToUnderKnee,
        value.shoulderToAboveKnee,
        value.shoulderToHeel,
        value.shoulderToHip,
        value.leg,
        value.sleeve,
        value.chest,
        value.waist,
        value.neck,
        value.hip,
        value.skinColor,
        value.hairColor,
        value.eyeColor,
        value.bodyForm,
        this.characterId,
      );

      if (
        updatedCharacter.characterName === this.characterObj.characterName &&
        updatedCharacter.gendar === this.characterObj.gendar &&
        updatedCharacter.characterType === this.characterObj.characterType &&
        updatedCharacter.age === this.characterObj.age &&
        updatedCharacter.headToFeet === this.characterObj.headToFeet &&
        updatedCharacter.shoulderToFeet === this.characterObj.shoulderToFeet &&
        updatedCharacter.shoulderToUnderKnee === this.characterObj.shoulderToUnderKnee &&
        updatedCharacter.shoulderToAboveKnee === this.characterObj.shoulderToAboveKnee &&
        updatedCharacter.shoulderToHeel === this.characterObj.shoulderToHeel &&
        updatedCharacter.shoulderToHip === this.characterObj.shoulderToHip &&
        updatedCharacter.leg === this.characterObj.leg &&
        updatedCharacter.sleeve === this.characterObj.sleeve &&
        updatedCharacter.chest === this.characterObj.chest &&
        updatedCharacter.waist === this.characterObj.waist &&
        updatedCharacter.neck === this.characterObj.neck &&
        updatedCharacter.hip === this.characterObj.hip &&
        updatedCharacter.skinColor === this.characterObj.skinColor &&
        updatedCharacter.hairColor === this.characterObj.hairColor &&
        updatedCharacter.eyeColor === this.characterObj.eyeColor &&
        updatedCharacter.bodyForm === this.characterObj.bodyForm
      ) {


      } else {
        this.submited = true;
        this.characterLoadedSucSub = this.AllocationService.characterLoadedSuc.subscribe(res => {
          if (res == true) {
            this.submited = true;
          }
        })
        if (
          updatedCharacter.gendar !== this.characterObj.gendar ||
          updatedCharacter.characterType !== this.characterObj.characterType ||
          updatedCharacter.age !== this.characterObj.age ||
          updatedCharacter.headToFeet !== this.characterObj.headToFeet ||
          updatedCharacter.skinColor !== this.characterObj.skinColor ||
          updatedCharacter.hairColor !== this.characterObj.hairColor ||
          updatedCharacter.chest !== this.characterObj.chest ||
          updatedCharacter.waist !== this.characterObj.waist ||
          updatedCharacter.eyeColor !== this.characterObj.eyeColor ||
          updatedCharacter.bodyForm !== this.characterObj.bodyForm
        ) {
          this.updateOneCharSup = this.charactersService.updateOneCharacter(updatedCharacter).subscribe(res => {
            if (res['message'] == "not found") {
              this.errorMessage = true;
              setTimeout(() => {
                this.errorMessage = false;
              }, 2000);
            } else {

              this.engServ.scene.remove.apply(this.engServ.scene, this.engServ.scene.children);
              this.engServ.render();
              this.engServ.createRenderer();
              this.engServ.createScene();
              this.engServ.createCamera();
              this.engServ.createLight();
              this.engServ.animate();
              this.engServ.addControls();
              this.charactersService.characterUrlFile.next(res['url']);
              this.charactersService.characterUrlType.next(res['urlType']);
              this.charactersService.characterSkinColor.next(res['skinColor']);
              this.charactersService.characterHairColor.next(res['hairColor']);
              this.charactersService.characterEyeColor.next(res['eyeColor']);

              this.updateSuccess = true;
              setTimeout(() => {
                this.updateSuccess = false;
              }, 2000);
            }


          
          }, error => this.errorMessage = true);


        } else {
          this.updateOneCharSup = this.charactersService.updateOneCharacter( updatedCharacter).subscribe(res => {

            if (res['message'] == "not found") {
              this.errorMessage = true;
              setTimeout(() => {
                this.errorMessage = false;
              }, 2000);
            } else {
              this.updateSuccess = true;
              setTimeout(() => {
                this.updateSuccess = false;
              }, 2000);
            }
          }, error => this.errorMessage = true);
        }

      }


    } else {
      const newCharacter = new character(
        value.characterName,
        value.gendar,
        value.characterType,
        value.age,
        value.headToFeet,
        value.shoulderToFeet,
        value.shoulderToUnderKnee,
        value.shoulderToAboveKnee,
        value.shoulderToHeel,
        value.shoulderToHip,
        value.leg,
        value.sleeve,
        value.chest,
        value.waist,
        value.neck,
        value.hip,
        value.skinColor,
        value.hairColor,
        value.eyeColor,
        value.bodyForm,
      );

      this.addCharSup = this.charactersService.addCharacter(newCharacter).subscribe(res => {
        this.characterId = res['id'];
        this.router.navigate(['pages/characters/character-edit/', this.characterId]);

        // this.engServ.scene.remove.apply(this.engServ.scene, this.engServ.scene.children);
        // this.engServ.render();
        // this.engServ.createRenderer();
        // this.engServ.createScene();
        // this.engServ.createCamera();
        // this.engServ.createLight();
        // this.engServ.animate();
        // this.engServ.addControls();
        // this.charactersService.characterUrlFile.next(res['url']);
        // this.charactersService.characterUrlType.next(res['urlType']);
        // this.charactersService.characterSkinColor.next(res['skinColor']);
        // this.charactersService.characterHairColor.next(res['hairColor']);
        // this.charactersService.characterEyeColor.next(res['eyeColor']);
       this.characterForm.reset();

      }, error => {
        this.errorMessage = true
        setTimeout(() => {
          this.errorMessage = false;
        }, 2000);
       // this.showToast('bottom-left', 'danger', `There is no suitable character`)
    
      });
    }
    this.characterObj = value;

  }
  showToast(position, status, message) {
    this.toastrService.show(
      '',
      message,
      { position, status });
  }
  ngOnDestroy(): void {
    this.getOneCharSup.unsubscribe();
    this.addCharSup.unsubscribe();
    this.updateOneCharSup.unsubscribe();
    this.routSub.unsubscribe();
    this.characterLoadedSucSub.unsubscribe();
  }

}
