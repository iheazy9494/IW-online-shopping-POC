import { EngineService } from './../../../threejs-service/threejs.service';

import { Subscription } from 'rxjs';
import { ItemsService } from './../items.service';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Inject, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DynamicScriptLoaderService } from '../../../DynamicScriptLoaderService';
import { Params, ActivatedRoute } from '@angular/router';
import { AllocationService } from '../../allocation/allocation.service';
import { environment } from '../../../../environments/environment';
import { PlyrComponent } from 'ngx-plyr';

@Component({
  selector: 'ngx-item-scene',
  templateUrl: './item-scene.component.html',
  styleUrls: ['./item-scene.component.scss'],

})
export class ItemSceneComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  error: string;
  @ViewChild('twodInput', { static: false }) myInput2DVariable: ElementRef;
  @ViewChild('videoInput', { static: false }) myInputVideoVariable: ElementRef;
  @ViewChild('threeSixtyInput', { static: false }) myInputthreeSixtyVariable: ElementRef;
  @ViewChild('threeDInput', { static: false }) myInputThreeDVariable: ElementRef;

  routSub: Subscription = new Subscription();
  getOneItemSup: Subscription = new Subscription();
  uploadFiles2DSub: Subscription = new Subscription();
  uploadFilesVideoSub: Subscription = new Subscription();
  uploadFiles360Sub: Subscription = new Subscription();
  uploadFiles3DSub: Subscription = new Subscription();
  deleteFileSub: Subscription = new Subscription();

  towDPreviewArr = [];
  videoPreviewArr = [];
  threeSixtyPreviewArr = [];
  threeDPreview = [];

  twodFiles: string[] = [];
  videoFile: string[] = [];
  threeSixetyFiles: string[] = [];
  threeDFile: string[] = [];
  towDValue;
  ItemId: number;
  editMode;
  threeSixtyFolder: string;
  apiUrl;

  disable360 = true;
  videoSource;

  fileUpload1 = { status: '', message: '', filePath: '' };
  fileUpload2 = { status: '', message: '', filePath: '' };
  fileUpload3 = { status: '', message: '', filePath: '' };
  fileUpload4 = { status: '', message: '', filePath: '' };


  uploadedFiles: any[] = [];
  public innerWidth: any;
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private modalService: BsModalService,
    private ItemsService: ItemsService,
    private dynamicScriptLoader: DynamicScriptLoaderService,
    private route: ActivatedRoute,
    private AllocationService: AllocationService,
    private engServ: EngineService,
  ) {

  }

  openModal(towdUpload: TemplateRef<any>, item) {
    this.modalRef = this.modalService.show(towdUpload);
    this.towDValue = item
  }

  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.load('js-cloudimage-360').then(data => {
      // Script Loaded Successfully
    }).catch(error => { });
  }
  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.innerWidth = window.innerWidth;
    this.routSub = this.route.params
      .subscribe((prams: Params) => {
        this.ItemId = +prams['id'];
        this.editMode = prams['id'] != null;
      });

    this.AllocationService.itemUrlFile.next(null);
    if (this.editMode) {
      this.getOneItemSup = this.ItemsService.getOneItem(this.ItemId).subscribe(res => {

        console.log(res)
        this.towDPreviewArr = res.twoD;
        this.videoPreviewArr = res.video;
        this.threeSixtyPreviewArr = res.surrounding
        this.threeDPreview = res.threeD;
        let threeD = this.threeDPreview[0];
        if (threeD != null) {
          this.AllocationService.itemUrlFile.next({itemId:this.ItemId ,itemUrl:res['link'] + threeD, itemSubType1:res['subtype1']});
        }
        this.videoSource = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4'
        // console.log(this.videoSource)
        this.loadScripts();
      }, error => this.error = error);
    }
    console.log(this.getOneItemSup)
  }



  onSelectFiletwo2(event) {
    if (event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        this.twodFiles.push(event.target.files[i]);
      }
    }

  }
  onSelectFileVideo(event) {
    if (event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        this.videoFile.push(event.target.files[i]);
      }
    }
  }
  onSelectFile360(event) {
    if (event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        this.threeSixetyFiles.push(event.target.files[i]);
      }
    }
  }
  onSelectFile3D(event) {
    if (event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        this.threeDFile.push(event.target.files[i]);
      }
    }
  }
  onUpload2D() {
    //alert(this.disable360)
    if (this.twodFiles.length > 0) {
      this.disable360 = false;
      const formData2d = new FormData();
      for (var i = 0; i < this.twodFiles.length; i++) {
        formData2d.append("files", this.twodFiles[i]);
      };
      this.uploadFiles2DSub = this.ItemsService.uploadFiles(this.ItemId, formData2d, '2d').subscribe(res => {
        this.fileUpload1 = res;
        //  console.log(this.fileUpload1.message)
        if (this.fileUpload1.message === "successful upload.") {
          this.disable360 = true;
          this.getOneItemSup = this.ItemsService.getOneItem(this.ItemId).subscribe(res2 => {
            this.towDPreviewArr = res2.twoD;
          }, error => this.error = error);
        } else {
          this.disable360 = false;
        }
      }, error => {
        this.error = error
      });

      this.myInput2DVariable.nativeElement.value = "";
      this.twodFiles = [];
    }
  }
  onDelete2D(item: string, index) {
    this.deleteFileSub = this.ItemsService.deleteFile(this.ItemId, item).subscribe(res => {
      this.towDPreviewArr.splice(index, 1);
    }, error => this.error = error);
  }
  onUploadVideo() {

    // alert(this.disable360)
    if (this.videoFile.length > 0) {
      this.disable360 = false;
      const formDatavideo = new FormData();
      for (var i = 0; i < this.videoFile.length; i++) {
        formDatavideo.append("file", this.videoFile[i]);
      };
      this.uploadFilesVideoSub = this.ItemsService.uploadFile(this.ItemId, formDatavideo, 'video').subscribe(res => {
        this.fileUpload2 = res;
        // console.log(this.fileUpload2)
        //console.log(res)
        if (this.fileUpload2['message'] === "upload success.") {
          this.disable360 = true;
          this.getOneItemSup = this.ItemsService.getOneItem(this.ItemId).subscribe(res2 => {
            this.videoPreviewArr = res2.video;
          }, error => this.error = error);
        } else {
          this.disable360 = false;
        }

      }, error => this.error = error);


      this.videoFile = [];
      this.myInputVideoVariable.nativeElement.value = "";
    }

  }
  onDeleteVideo(item: string, index) {
    this.deleteFileSub = this.ItemsService.deleteFile(this.ItemId, item).subscribe(res => {
      this.videoPreviewArr.splice(index, 1);

    }, error => this.error = error);
  }
  mySubscription: any;

  onUpload360() {
    // alert(this.disable360)
    if (this.threeSixetyFiles.length > 0) {
      this.disable360 = false;
      const formData360 = new FormData();
      for (var i = 0; i < this.threeSixetyFiles.length; i++) {
        formData360.append("files", this.threeSixetyFiles[i]);
      };
      this.uploadFiles360Sub = this.ItemsService.uploadFiles(this.ItemId, formData360, '360').subscribe(res => {
        this.fileUpload3 = res;
        // console.log(this.fileUpload1.message)
        if (this.fileUpload3['message'] === "successful upload.") {
          if (this.disable360 = true) {
            // alert(this.disable360)
            setTimeout(() => {
              window.location.reload();
            }, 1000);

          }

        }
      }, error => {
      });
      this.threeSixetyFiles = [];
      this.myInputthreeSixtyVariable.nativeElement.value = "";
    }

  }
  show360 = true;
  onDelete360() {
    this.deleteFileSub = this.ItemsService.deleteFile(this.ItemId, '360').subscribe(res => {
      this.show360 = false;
    }, error => this.error = error);
  }
  onUpload3D() {
    this.disable360 = false;
    if (this.threeDFile.length > 0) {
      const formData3d = new FormData();
      for (var i = 0; i < this.threeDFile.length; i++) {
        formData3d.append("file", this.threeDFile[i]);
      };
      this.threeDPreview = null;
      this.uploadFiles3DSub = this.ItemsService.uploadFile(this.ItemId, formData3d, '3d').subscribe(res => {
        this.fileUpload4 = res;
        // console.log(this.fileUpload4)
        if (this.fileUpload4['message'] === "upload success.") {
          this.disable360 = true;
          this.getOneItemSup = this.ItemsService.getOneItem(this.ItemId).subscribe(res2 => {
            this.threeDPreview = res2.threeD;
            let threeD = this.threeDPreview[0];

            this.AllocationService.itemUrlFile.next({itemId:this.ItemId ,itemUrl:res2['link'] + threeD, itemSubType1:res2['subtype1']});
            console.log({itemId:this.ItemId })
            console.log({itemUrl:res2['link'] + threeD})

            console.log({ itemSubType1:res2['subtype1']})

            this.engServ.scene.remove.apply(this.engServ.scene, this.engServ.scene.children);
            this.engServ.render();
            this.engServ.createRenderer();
            this.engServ.createScene();
            this.engServ.createCamera();
            this.engServ.createLight();
            this.engServ.animate();
            this.engServ.addControls();
          }, error => this.error = error);
        } else {
          this.disable360 = false;
        }
      }, error => this.error = error);

      this.threeDFile = [];
      this.myInputThreeDVariable.nativeElement.value = "";
    }
  }
  onDelete3D(item: string, index) {
    this.deleteFileSub = this.ItemsService.deleteFile(this.ItemId, item).subscribe(res => {
      this.threeDPreview.splice(index, 1);
   
      this.AllocationService.itemUrlFile.next(null);
      this.engServ.scene.remove.apply(this.engServ.scene, this.engServ.scene.children);
      
      this.engServ.render();
      this.engServ.createRenderer();
      this.engServ.createScene();
      this.engServ.createCamera();
      this.engServ.createLight();
      this.engServ.animate();
      this.engServ.addControls();
    }, error => this.error = error);
  }


  @ViewChild(PlyrComponent, { static: false }) plyr: PlyrComponent;

  // or get it from plyrInit event
  player: Plyr;

  videoSources: Plyr.Source[] = [
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
      type: 'video/mp4',
      size: 576,
    },
  ];
  played(event: Plyr.PlyrEvent) {
    //console.log('played', event);
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.getOneItemSup.unsubscribe();
    this.uploadFiles2DSub.unsubscribe();
    this.uploadFilesVideoSub.unsubscribe();
    this.uploadFiles360Sub.unsubscribe();
    this.uploadFiles3DSub.unsubscribe();
  }

}
