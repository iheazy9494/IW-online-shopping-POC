import { tap } from "rxjs/operators";
import { map } from "rxjs/operators";
import { HttpClient, HttpEventType, HttpEvent } from "@angular/common/http";
import { Router } from "@angular/router";
import { AllocationService } from "./../../allocation/allocation.service";
import { charactersService } from "./../../characters/characters.service";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  OnDestroy,
  AfterViewInit,
  Inject,
} from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { EngineService } from "../../../threejs-service/threejs.service";
import * as THREE from "three";
import { Download } from "./../../../download";
import { Observable } from "rxjs";
import { DownloadService } from "../../../download.service";
import { DOCUMENT } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { IfStmt } from "@angular/compiler";
@Component({
  selector: "ngx-character-scene",
  templateUrl: "./character-scene.component.html",
  styleUrls: ["./character-scene.component.scss"],
})
export class CharacterSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  runAnimation = new Subject<boolean>();

  @ViewChild("rendererCanvas", { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  characterUrlFileSub: Subscription = new Subscription();
  characterUrlTypeSub: Subscription = new Subscription();
  characterSkinColorSub: Subscription = new Subscription();
  characterHairColorSub: Subscription = new Subscription();
  characterEyeColorSub: Subscription = new Subscription();

  sceneLoadedSub: Subscription = new Subscription();
  itemFitSub: Subscription = new Subscription();
  downloadFileSub: Subscription = new Subscription();
  //character materials color
  manChar;
  womanChar;
  boyChar;
  girlChar;
  characterSkinColor;
  characterHairColor;
  characterEyeColor;

  //char skin or fat
  characterUrlType: string;

  //char gender fit
  charType: string;
  characterName: any;
  //check download file
  download$: Observable<Download>;
  fileDownloaded;
  loadedFileSize = 0;

  characterFounded;

  chURLLL;
  hideAnim:boolean = true;
  sceneBg = [
    {
      thum: "assets/threejs/thum-threejs-bg2.jpg",
      bg: "assets/threejs/threejs-bg2.jpg",
    },
    {
      thum: "assets/threejs/thum-threejs-bg.jpg",
      bg: "assets/threejs/threejs-bg.jpg",
    },
    {
      thum: "assets/threejs/thum-threejs-bg3.jpg",
      bg: "assets/threejs/threejs-bg3.jpg",
    },
  ];

  constructor(
    private engServ: EngineService,
    private charactersService: charactersService,
    private AllocationService: AllocationService,
    private router: Router,
    private downloads: DownloadService,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private dbService: NgxIndexedDBService
  ) {}

  selectedIndex: number = null;
  selectedBg;
  changeSceneBg(item, i) {
    this.selectedIndex = i;
    this.selectedBg = item.bg;
    localStorage.setItem("sceneBg", this.selectedBg);
    var texture = new THREE.TextureLoader().load(item.bg, (res) => {
      this.engServ.scene.background = res;
      this.engServ.render();
    });
    texture.minFilter = THREE.LinearFilter;
  }

  //reset morph or shape key


  fullscreen = false;
  full() {
    this.fullscreen = !this.fullscreen;
    this.engServ.render();
    this.engServ.resize();
    this.engServ.animate();
  }


  downPC= 0;

  ngOnInit() {
    this.engServ.getCanvas(this.rendererCanvas);
    this.engServ.createRenderer();
    this.engServ.createScene();
    this.engServ.createCamera();
    this.engServ.createLight();
    this.engServ.animate();
    this.engServ.addControls();
    this.engServ.resize();

    let sceneBg = localStorage.getItem("sceneBg");
    if (sceneBg) {
      let texture = new THREE.TextureLoader().load(sceneBg, (res) => {
        this.engServ.scene.background = res;
        this.engServ.render();
      });
      texture.minFilter = THREE.LinearFilter;
    }
  // this.engServ.loadModel('assets/man-m-160.glb', null,0);
  
    
    this.characterUrlFileSub = this.charactersService.characterUrlFile.subscribe(
      (res) => {
        if (res != null) {
          this.chURLLL = res;
          this.fileDownloaded = true;
          this.characterName = res.replace("/file-transfer-service/characters/", "").replace(".glb", "");
          this.charType = this.characterName .substring(this.characterName .indexOf("-") + 1);

          this.setManChar(this.charType);
          this.setWomanChar(this.charType);
          this.setBoyChar(this.charType);
          this.setGirlChar(this.charType);

          console.log(this.characterName );

          this.dbService.getAll("characters").then(
            (characters) => {
              let found;
              let notfound;

              if (characters.length > 0) {
                for (let index = 0; index < characters.length; index++) {
                  if (characters[index]["name"] === this.characterName ) {
                    found = true;
                    let body = characters[index]["file"];
                    let file = new Blob([body], { type: "application/glb" });
                    let fileURL = URL.createObjectURL(file);
                    this.engServ.loadModel(fileURL, null, 0);
                    this.fileDownloaded = false;
                    this.AllocationService.characterLoadedSuc.next(true);
                  } else {
                    notfound = false;
                  }
                }
              }

              if (
                (notfound == false && found != true) ||
                characters.length <= 0
              ) {
                this.downloadFileSub = this.download(environment.apiUrl + ":8100" + res).subscribe((res2) => {
                 
                
                  if (res2.status === 200 && res2.type == 4) {
                  
                    let body = res2["body"];
                    let file = new Blob([body], { type: "application/glb" });
                    let fileURL = URL.createObjectURL(file);
                    this.engServ.loadModel(fileURL, null, 0);
                    this.fileDownloaded = false;
                    this.AllocationService.characterLoadedSuc.next(true);
                    this.dbService.add("characters", { name: this.characterName , file: body })
                      .then(
                        () => {
                          //  alert(true)
                        },
                        (error) => {
                          //console.log(error);
                        }
                      );
                  }
                });
              }
            },
            (error) => {
              //console.log(error);
              this.characterFounded = false;
            }
          );
        } else {
          this.fileDownloaded = false;
        }
      }
    );

    this.characterUrlTypeSub = this.charactersService.characterUrlType.subscribe(
      (res) => {
        this.characterUrlType = res;
      }
    );

    this.characterSkinColorSub = this.charactersService.characterSkinColor.subscribe(
      (res) => {
        this.characterSkinColor = res;
      }
    );
    this.characterHairColorSub = this.charactersService.characterHairColor.subscribe(
      (res) => {
        this.characterHairColor = res;
      }
    );
    this.characterEyeColorSub = this.charactersService.characterEyeColor.subscribe(
      (res) => {
        this.characterEyeColor = res;
      }
    );

    this.itemFitSub = this.AllocationService.itemUrlFile.subscribe((res) => {
    
      if (res != null) {

        let mesh;
        let load = true;
        if(this.engServ.scene){
          this.engServ.scene.traverse((o) => {
            if (o instanceof THREE.Mesh || o instanceof THREE.SkinnedMesh) {
              let itemName  = res['itemUrl'].replace("/file-transfer-service/items/"+ res['itemId'] +"/3d/", "").replace(".glb", "");
              console.log(itemName)
              if (o.name.includes(itemName)) {
                console.log(itemName)
                console.log("the same");
                this.AllocationService.itemLoadedSuc.next(false);
                mesh = o;
                load = false;
                return false;
              }else{
                if (o.name.includes(res['itemSubType1'].replace("-", "").toLowerCase())) {
                 // alert("not the same");
                  console.log("not the same");
                  console.log(res['itemSubType1']);
                  load = false;
                  let selectedObject = this.engServ.scene.getObjectByName(o.name);
                  
                  this.engServ.scene.remove(selectedObject);
                  this.engServ.scene.remove(selectedObject.parent.parent);
                  console.log(o)
                
                  o.geometry.dispose();
                  selectedObject = undefined;
                  load = true;
                }

              }
  
             
            }
          });
        }

    
        // this.engServ.scene.traverse((o) => {
        //   if (o instanceof THREE.Mesh) {
           
        //   }
        // });
    
        if (load) {
          this.fileDownloaded = true;

          this.downloadFileSub = this.download(environment.apiUrl + ":8100" + res['itemUrl']).subscribe((res) => {
            if (res.status === 200 && res.type == 4) {
              let body = res["body"];
              var file = new Blob([body], { type: "application/glb" });
              var fileURL = URL.createObjectURL(file);
              this.engServ.loadModel(fileURL, null, 0);
              this.fileDownloaded = false;
              this.AllocationService.itemLoadedSuc.next(false);
            }
          });
  
          load = false;
          return true;
        }
      }
    });

  }

  status = false;
  onAnim() {
    this.status = true;
    this.engServ.runAnimation.next(this.status);
  //  console.log(this.engServ.animation)
  //  console.log(this.engServ.mixers)
   for (const p of this.engServ.actions) {
    p.play();
}
    this.engServ.render();
    // if(!this.status){
    //   window.location.reload()
    // }
  
  }

  onStop(){
    for (const p of this.engServ.actions) {
      p.stop().reset()
  }
    this.engServ.runAnimation.next(false);
    this.engServ.render()

  }
rest(){
  this.engServ
}
  download(url: any): Observable<any> {
    return this.http.get(url, {
      reportProgress: true,
      observe: "events",
      responseType: "blob",
    });
  };

  skinMale = {
    skinWhite: {
      images: [
        "assets/white_color/Std_Skin_Head_diffuse.jpg",
        "assets/white_color/Std_Skin_Body_diffuse.jpg",
        "assets/white_color/Std_Skin_Arm_diffuse.jpg",
        "assets/white_color/Std_Skin_Leg_diffuse.jpg",
        "assets/white_color/Std_Nails_diffuse.jpg",
      ],
    },
    skinBlack: {
      images: [
        "assets/dark_brown_color/Std_Skin_Head_diffuse.png",
        "assets/dark_brown_color/Std_Skin_Body_diffuse.png",
        "assets/dark_brown_color/Std_Skin_Arm_diffuse.png",
        "assets/dark_brown_color/Std_Skin_Leg_diffuse.png",
        "assets/dark_brown_color/Std_Nails_diffuse.png",
      ],
    },
    goldenColor: {
      images: [
        "assets/golden_color/Std_Skin_Head_diffuse.png",
        "assets/golden_color/Std_Skin_Body_diffuse.png",
        "assets/golden_color/Std_Skin_Arm_diffuse.png",
        "assets/golden_color/Std_Skin_Leg_diffuse.png",
        "assets/golden_color/Std_Nails_diffuse.jpg",
      ],
    },
    children: [
      "Std_Skin_Head",
      "Std_Skin_Body",
      "Std_Skin_Arm",
      "Std_Skin_Leg",
      "Std_Nails",
    ],
  };

  setManChar(v: string) {
    this.manChar = {
      children: {
        body: {
          skin: ["man-body-" + v + "_0"],
          underware: ["man-body-" + v + "_1"],
        },
        head: {
          skin: ["man-head-" + v + "_0"],
          "eye outside": ["man-head-" + v + "_1"],
          eye: ["man-head-" + v + "_2"],
          "hair and beard": ["man-head-" + v + "_3"],
          eyeInside: ["man-head-" + v + "_4"],
        },
      },
    };
  }
  setWomanChar(v: string) {
    this.womanChar = {
      children: {
        body: {
          skin: ["woman-body-" + v + "_0"],
          underware: ["woman-body-" + v + "_1"],
        },
        head: {
          hair: ["woman-head-" + v + "_0"],
          skin: ["woman-head-" + v + "_1"],
          "eye outside": ["woman-head-" + v + "_2"],
          "eye brows": ["woman-head-" + v + "_3"],
          eye: ["woman-head-" + v + "_4"],
        },
      },
    };
  }
  setBoyChar(v: string) {
    this.boyChar = {
      children: {
        body: {
          eye: ["boy-body-" + v + "_0"],
          "eye outside": ["boy-body-" + v + "_1"],
          skin: ["boy-body-" + v + "_2"],
          eyeInside: ["boy-body-" + v + "_3"],
          hair: ["boy-body-" + v + "_4"],
          shourt: ["boy-body-" + v + "_5"],
        },
      },
    };
  }

  setGirlChar(v: string) {
    this.girlChar = {
      children: {
        body: {
          tshirt: ["girl-body-" + v + "_0"],
          eye: ["girl-body-" + v + "_1"],
          skin: ["girl-body-" + v + "_2"],
          "under ware": ["girl-body-" + v + "_3"],
          hair: ["girl-body-" + v + "_4"],
          eyeoutside: ["girl-body-" + v + "_5"],
        },
      },
    };
  }

  AfterSceneLoaded() {
    // if (this.characterSkinColor) {
    //   this.engServ.loadSkin(this.characterSkinColor, this.manChar.children.body.skin);
    //   this.engServ.loadSkin(this.characterSkinColor, this.manChar.children.head.skin);
    //   this.engServ.loadSkin(this.characterSkinColor, this.womanChar.children.body.skin);
    //   this.engServ.loadSkin(this.characterSkinColor, this.womanChar.children.head.skin);
    //   this.engServ.loadSkin(this.characterSkinColor, this.boyChar.children.body.skin);
    //   this.engServ.loadSkin(this.characterSkinColor, this.girlChar.children.body.skin);
    // }
    // if (this.characterHairColor) {
    //   this.engServ.loadSkin(this.characterHairColor, this.manChar.children.head["hair and beard"]);
    //   this.engServ.loadSkin(this.characterHairColor, this.womanChar.children.head.hair);
    //   this.engServ.loadSkin(this.characterHairColor, this.boyChar.children.body.hair);
    //   this.engServ.loadSkin(this.characterHairColor, this.girlChar.children.body.hair);
    // }
    // if (this.characterEyeColor) {
    //   this.engServ.loadSkin(this.characterEyeColor, this.manChar.children.head.eye);
    //   this.engServ.loadSkin(this.characterEyeColor, this.womanChar.children.head.eye);
    //   this.engServ.loadSkin(this.characterEyeColor, this.boyChar.children.body.eye);
    //   this.engServ.loadSkin(this.characterEyeColor, this.girlChar.children.body.eye);
    // }
    //this.engServ.loadSkinImage(this.skinMale.skinBlack.images, this.skinMale.children, 1)
    // this.engServ.loadSkinImage(this.skinMale.skinWhite.images, this.skinMale.children, 1)
    //this.engServ.loadSkinImage(this.skinMale.goldenColor.images, this.skinMale.children, 1)
  }


  morphReset(v) {
    v.forEach((e, i) => {
      v[i] = 0;
    });
  }


  thereis180 = "false";
  thereis150 = "false";
  thereisXl = "false";

  ngAfterViewInit(): void {
    this.sceneLoadedSub = this.engServ.sceneLoaded.subscribe((res) => {
      if (res == true) {
        this.AfterSceneLoaded();
        this.engServ.render();
        console.log(this.characterName)
          //run shape key based on character name
          try {
            this.engServ.scene.traverse((o) => {
              if (o instanceof THREE.Mesh) {
                
                if(o.morphTargetDictionary){
                  // alert("shape key found")
                  o.morphTargetInfluences[o.morphTargetDictionary[this.characterName]]=1
                }
                // if(o.morphTargetInfluences[o.morphTargetDictionary[this.characterName]]) alert("shape key found")
              }
            });
          } catch (e) {}

  
        // try {
        //   this.engServ.scene.traverse((o) => {
        //     if (o instanceof THREE.Mesh) {
        //       if (this.router.url.includes("item-edit")) {
        //      //   o.position(0,0,0)
        //       }

        //       // if (o.name.includes("xl")) {
        //       //   this.thereisXl = "true";
        //       // }
        //     }
        //   });
        // } catch (e) {}
        if (this.router.url.includes("item-edit")) {
          this.hideAnim = false
           }

     
          //set BG of scene
        let sceneBg = localStorage.getItem("sceneBg");
        if (sceneBg) {
          let texture = new THREE.TextureLoader().load(sceneBg, (res) => {
            this.engServ.scene.background = res;
            this.engServ.render();
          });
          texture.minFilter = THREE.LinearFilter;
        }
      }
    });
  }



  loadHairStyle(style) {
    let mesh;
    let load = true;
    this.engServ.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        if (o.name.includes("man_s_160_hair" + style)) {
          alert("yes");
          mesh = o;
          load = false;
          return false;
        }
      }
    });

    this.engServ.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        if (o.name.includes("hair")) {
          load = false;
          let selectedObject = this.engServ.scene.getObjectByName(o.name);
          this.engServ.scene.remove(selectedObject);
          this.engServ.scene.remove(selectedObject.parent);
          o.geometry.dispose();
          selectedObject = undefined;
          load = true;
        }
      }
    });

    if (load) {
      this.engServ.loadModel(
        "assets/t/hairStyles/man_s_160_hair" + style + ".glb",
        null,
        null
      );
      load = false;
      return true;
    }
    // if (this.traversed2) {

    // if (mesh.name.includes('man_s_160_hair' + style)) {
    //   return false
    // } else {

    // }
  }

  loadTypeStyle(style, type) {
    let mesh;
    let load = true;
    this.engServ.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        if (o.name.includes("man_s_160_" + type + style)) {
          alert("yes");
          mesh = o;
          load = false;
          return false;
        }
      }
    });

    this.engServ.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        if (o.name.includes(type)) {
          mesh = o;
        }
      }
    });

    if (mesh) {
      load = false;
      let selectedObject = this.engServ.scene.getObjectByName(mesh.name);
      this.engServ.scene.remove(selectedObject);
      //   this.engServ.scene.remove(selectedObject.parent);
      load = true;
    }
    if (load) {
      this.engServ.loadModel(
        "assets/t/" + type + "Styles/man_s_160_" + type + style + ".glb",
        null,
        null
      );
      load = false;
      return true;
    }
    // if (this.traversed2) {

    // if (mesh.name.includes('man_s_160_beard' + style)) {
    //   return false
    // } else {

    // }
  }

  restShapeKey(v, shape) {
    v.forEach((e, i) => {
      v[i] = 0;
    });
  }

  runShapeKey(shape, family) {
    this.engServ.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        Object.keys(o.morphTargetDictionary).forEach((e, i) => {
          if (e.includes(family)) {
            //console.log(e);
            if ((o.morphTargetInfluences[o.morphTargetDictionary[e]] = 1)) {
              o.morphTargetInfluences[o.morphTargetDictionary[e]] = 0;
            }
          }
        });

        o.morphTargetInfluences[o.morphTargetDictionary[shape]] = 1;
      }
    });
   // console.log(this.engServ.scene.children);
    this.engServ.resize();
    this.engServ.render();
    this.engServ.animate();
  }

  ngOnDestroy(): void {
    if (this.engServ.frameId != null) {
      cancelAnimationFrame(this.engServ.frameId);
    }
    this.sceneLoadedSub.unsubscribe();
    if (this.characterUrlFileSub)  this.characterUrlFileSub.unsubscribe();
    if (this.characterUrlTypeSub)  this.characterUrlTypeSub.unsubscribe();
    if (this.itemFitSub) this.itemFitSub.unsubscribe();
    if (this.characterSkinColorSub)  this.characterSkinColorSub.unsubscribe();
    if (this.downloadFileSub) this.downloadFileSub.unsubscribe();
    if (this.characterHairColorSub) this.downloadFileSub.unsubscribe();
    if (this.characterEyeColorSub) this.downloadFileSub.unsubscribe();

    this.engServ.runAnimation.next(false);

  }



}
