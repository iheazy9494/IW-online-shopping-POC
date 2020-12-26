import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Injectable, ElementRef, OnDestroy, NgZone, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

@Injectable({
    providedIn: 'root',
})
export class EngineService implements OnDestroy {

    runAnimation = new Subject<boolean>()
    fileDownloaded = new Subject<boolean>()

    private canvas: HTMLCanvasElement;
    public renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;
    private gltfLoader: GLTFLoader;
    public model: THREE.Object3D;
    public frameId: number = null;
    public controls;
    sceneLoaded = new Subject<boolean>();

    constructor(private ngZone: NgZone) { }


    getCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = canvas.nativeElement;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            //alpha: true,    // transparent background
            antialias: true, // smooth edges
            powerPreference : "default" 
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.autoClear = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    createScene(): void {
        // create the scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xc7c7c7);

        const texture = new THREE.TextureLoader().load('assets/threejs/threejs-bg2.jpg');
        texture.minFilter = THREE.LinearFilter;
        this.scene.background = texture;
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        if (window.innerWidth <= 767) {
            this.camera.position.z = 25;
        } else {
            this.camera.position.z = 20;
        }
        this.camera.position.x = 0;
        this.scene.add(this.camera);
    }

    createLight() {
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 0.4);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
        this.camera.add(hemiLight);

        let d = 8.25;
        let dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
        dirLight.position.set(-8, 12, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.camera.left = d * -1;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = d * -1;
        // Add directional Light to scene
        this.camera.add(dirLight);

        let dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        dirLight2.position.set(8, 12, -8);
        dirLight2.castShadow = true;
        dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight2.shadow.camera.near = 0.1;
        dirLight2.shadow.camera.far = 1500;
        dirLight2.shadow.camera.left = d * -1;
        dirLight2.shadow.camera.right = d;
        dirLight2.shadow.camera.top = d;
        dirLight2.shadow.camera.bottom = d * -1;
        // Add directional Light to scene
        this.camera.add(dirLight2);

    }

    addControls() {
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.rotateSpeed = 1.1;
        this.controls.zoomSpeed = 1.2;
        this.controls.addEventListener('change', this.render.bind(this));

        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minPolarAngle = Math.PI / 3;
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.dampingFactor = 0.1;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5; // 30

        this.controls.minDistance = 17;

        if (window.innerWidth <= 767) {
            this.controls.maxDistance = 25;
        } else {
            this.controls.maxDistance = 20;
        }
    }

    animate(): void {
        this.ngZone.runOutsideAngular(() => {
            if (document.readyState !== 'loading') {
                this.render();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    this.render();
                });
            }

            window.addEventListener('resize', () => {
                this.resize();
                this.render();
            });
        });
    }

    clock = new THREE.Clock();
    run
    render() {
        this.frameId = requestAnimationFrame(() => {
            // this.render();
        });
        this.runAnimation.subscribe(res => {
            this.run = res
            console.log(this.run)
        })
        this.renderer.setAnimationLoop(() => {
            if (this.run) {
                this.render();
                const delta = this.clock.getDelta();
                for (const mixer of this.mixers) {
                    mixer.update(delta);
                }
            }
           
        });
      
        this.renderer.render(this.scene, this.camera);

    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    loadModel(fileURl: any, position, index) {
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.load(fileURl, (gltf) => {
            this.model = gltf.scene
            this.model.scale.set(5, 5, 5);
            console.log(gltf)
            if (position != null) {
                this.model.position.set(position.x, position.y, position.z)
            } else {
                this.model.position.set(0, -4.5, 0)
            }
            this.scene.add(this.model);
            this.sceneLoaded.next(true);

            this.createGUI(this.model, gltf.animations, index)
            console.log(this.scene)
            this.render();
        }, undefined, undefined);
    };
    mixers = [];
    mixer;
    // actions;
    activeAction;
    actions:any = []
    animation
    createGUI(model, animations, index) {
        this.animation = animations[index];
        const mixer = new THREE.AnimationMixer(this.model);
        this.mixers.push(mixer);
        this.actions.push(mixer.clipAction(this.animation))

        for (const p of this.actions) {
            p.play();
        }

      
    }
    // loader = new FBXLoader();
    // loadModelFBX(fileURl: any, position) {
    //     this.loader.load(fileURl, (gltf) => {
    //         this.model = gltf.children[0];
    //         //this.model.scale.set(5, 5, 5);
    //         console.log(gltf)
    //         if (position != null) {
    //             this.model.position.set(position.x, position.y, position.z)
    //         } else {
    //             this.model.position.set(0, -4, 0)
    //         }
    //         this.scene.add(this.model);
    //         this.sceneLoaded.next(true);
    //         console.log(this.scene)
    //         this.render();
    //     }, undefined, undefined);
    // };

    loadSkinImage(image, names, textureRepeat) {
        //skinTextures is loaded from server via skinUrl
        let textureLoader = new THREE.TextureLoader();
        let texture;
        let textureMTL;
        if (Array.isArray(image)) {
            image.forEach((element, index) => {
                texture = textureLoader.load(element);
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.x = textureRepeat;
                texture.repeat.y = textureRepeat;
                texture.flipY = false;
                textureMTL = new THREE.MeshStandardMaterial({
                    map: texture,
                });
                this.scene.traverse((o) => {
                    if (o instanceof THREE.Mesh) {
                        if (o['material']['name'] === names[index]) {
                            // console.log(o)
                            // // o.material['map']['image']['src'] = element
                            // o.material['map'] = THREE.ImageUtils.loadTexture(element);
                            // o.material['needsUpdate'] = true;

                            var texture = new THREE.TextureLoader().load(element, res => {
                                o.material['map'] = res
                                this.render();
                            });
                            texture.minFilter = THREE.LinearFilter;
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.x = textureRepeat;
                            texture.repeat.y = textureRepeat;
                            texture.flipY = false;
                            // o.material = textureMTL;
                            // o.material['morphTargets'] = true;
                            // o.material['morphNormals'] = true
                        }
                    }
                });
            });
        }
        textureMTL.map.minFilter = THREE.LinearFilter;
        this.render();
    };
    loadSkin(color, names) {
        // skinTextures is loaded from server via skinUrl
        let textureMTL;
        if (Array.isArray(names)) {
            names.forEach((element, index) => {
                textureMTL = new THREE.MeshStandardMaterial({
                    color: color,
                    skinning: true,
                    // roughness: 0.6,
                });
                this.scene.traverse((o) => {
                    if (o instanceof THREE.Mesh) {
                        if (o.name === names[index]) {
                            o.material = textureMTL;
                            o.material['morphTargets'] = true;
                            o.material['morphNormals'] = true;
                        }
                    }
                });
            });
        }
    };

    // loadOthers(image, names, textureRepeat) {
    //     let textureLoaderM = new THREE.TextureLoader()
    //     let textureM;
    //     let textureMTLM;
    //     if (Array.isArray(image)) {
    //         image.forEach((element, index) => {
    //             textureM = textureLoaderM.load(element);
    //             textureM.wrapS = textureM.wrapT = THREE.RepeatWrapping;
    //             textureM.repeat.x = textureRepeat;
    //             textureM.repeat.y = textureRepeat;
    //             textureM.flipY = false;
    //             textureMTLM = new THREE.MeshPhongMaterial({
    //                 map: textureM, color: 0xffffff,
    //                 skinning: true,
    //             });
    //             textureMTLM.map.minFilter = THREE.LinearFilter;
    //             this.scene.traverse((o) => {
    //                 if (o instanceof THREE.Mesh) {
    //                     if (o.name === names[index]) {
    //                         o.material = textureMTLM;
    //                         o.material['morphTargets'] = true;
    //                         o.material['morphNormals'] = true
    //                     }
    //                 }
    //             });
    //         });
    //         textureMTLM.map.minFilter = THREE.LinearFilter;

    //     } else {
    //         textureM = textureLoaderM.load(image);
    //         textureM.wrapS = textureM.wrapT = THREE.RepeatWrapping;
    //         textureM.repeat.x = textureRepeat;
    //         textureM.repeat.y = textureRepeat;
    //         textureM.flipY = false;
    //         textureMTLM = new THREE.MeshPhongMaterial({
    //             map: textureM, color: 0xffffff,
    //             skinning: true,
    //         });
    //         this.scene.traverse((o) => {
    //             if (o instanceof THREE.Mesh) {
    //                 if (o.name === names) {
    //                     o.material['morphTargets'] = true;
    //                     o.material['morphNormals'] = true
    //                     o.material = textureMTLM;
    //                 }
    //             }
    //         });
    //         textureMTLM.map.minFilter = THREE.LinearFilter;
    //     }
    // }

    ngOnDestroy() {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
        }
    }
}
