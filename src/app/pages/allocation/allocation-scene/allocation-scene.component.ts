import { EngineService } from './../../../threejs-service/threejs.service';
import { SearchItem } from './../searchItem.model';
import { AllocationService } from './../allocation.service';
import { character } from './../../characters/character.model';
import { charactersService } from './../../characters/characters.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'ngx-allocation-scene',
  templateUrl: './allocation-scene.component.html',
  styleUrls: ['./allocation-scene.component.scss']
})
export class AllocationSceneComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;

  routSub: Subscription = new Subscription();
  getOneCharSup: Subscription = new Subscription();

  characterId;

  character:character;

  constructor(private route: ActivatedRoute, private charactersService: charactersService, private modalService: BsModalService,private engServ: EngineService) { }

  ngOnInit() {
    this.routSub = this.route.params
      .subscribe((prams: Params) => {
        this.characterId = +prams['id']; //add + to convert string id to number
      });
    if (this.characterId) {
      this.getOneCharSup = this.charactersService.getOneCharacter(this.characterId).subscribe((res: character) => {

        this.character = res;
        
        this.charactersService.characterUrlFile.next(res['url']);
        this.charactersService.characterUrlType.next(res['urlType'])

        this.charactersService.characterSkinColor.next(res['skinColor']);
        this.charactersService.characterHairColor.next(res['hairColor']);
        this.charactersService.characterEyeColor.next(res['eyeColor']);
      });
    }

  
  }

  openModal(characterInfo: TemplateRef<any>) {
    this.modalRef = this.modalService.show(characterInfo, {  class: 'modal-lg' });
  }

  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.getOneCharSup.unsubscribe();
  }

}
