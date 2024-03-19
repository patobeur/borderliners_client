import * as THREE from "three";
import { _cameras } from "./cameras.js";
import { _console } from "./console.js";
import { _soleil } from "./soleil.js";
import { _floors } from "./floors.js";
import { _model } from "./models.js";
import { _renderer } from "./renderer.js";
import { _formulas } from "./formulas.js";
import { _vr } from "./vr.js";
export let _scene = {
	scene: null,
	_sets: null,
	controller: null,
	//---------------
	cube: null,
	floor: null,
	_setThemAll: function () {
		this._sets = {
			scene: () => {
				this.scene = new THREE.Scene();
				console.log('scene ok')
			},
			axesHelper: () => {
				// const axesHelper = new THREE.AxesHelper(1000);
				// axesHelper.position.set(0, 0, 0);
				// axesHelper.name = 'WorldAxessHelper';
				// this.scene.add(axesHelper);
			},
			floor: () => {
				_floors.init()
				this.floor = _floors.floor
				this.scene.add(this.floor);
				console.log('floor ok')
			},
			renderer: () => {
				_renderer.init()
				// this.renderer = new THREE.WebGLRenderer({
				// 	antialias: true,
				// 	alpha: true,
				// });
				// this.renderer.shadowMap.enabled = true;
				// this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
				// this.renderer.setSize(window.innerWidth, window.innerHeight);
				// this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
				// // Set background color.
				// // this.renderer.setClearColor(0xaaaaaa);
				// this.renderer.setClearColor(0x000010, 1.0);

				// // Turn on VR support
				// this.renderer.xr.enabled = true;
				// document.body.appendChild(this.renderer.domElement);
				// console.log('renderer ok')
			},
			addColonnes: () => {
				// let i = 0;
				// [
				// 	{ x: -5.25, y: -5.25, z: 0 },
				// 	{ x: 5.25, y: 5.25, z: 0 },
				// 	{ x: -5.25, y: 5.25, z: 0 },
				// 	{ x: 5.25, y: -5.25, z: 0 }
				// ].forEach(pos => { i++; this.addColonnes(pos, i) });
				console.log('-------------------------')
				console.log(this.floor.size)
				for (let index = 0; index < 100; index++) {
					this.addCubes()
				}
			},
			lights: () => {
				const ambient = new THREE.AmbientLight(0xffffff, .5);
				this.scene.add(ambient);

				const pointLight = new THREE.PointLight(0xffffff, 1);
				pointLight.castShadow = true;
				pointLight.position.set(0, 100, 100);
				this.scene.add(pointLight);

				const pointLight2 = new THREE.PointLight(0xffffff, 1);
				pointLight2.castShadow = true;
				pointLight2.position.set(2, 2, 3);
				this.scene.add(pointLight2);
				console.log('lights ok')

			},
			sun: () => {
				_soleil.init(this.floor.size)
				console.log('sun ok')
			},
			cameras: () => {
				_cameras.init();
				console.log('cameras ok (matrixed and rendered')
				_cameras.currentPack.camera.updateProjectionMatrix();
				_renderer.renderer.render(this.scene, _cameras.currentPack.camera);
				console.log('camera ok')
			},
			vr: () => {
				_vr.init()
				_vr.renderCamera();
				// this.controller = _renderer.renderer.xr.getController(0);
				// // this.controller.addEventListener('select', onSelect);
				// this.scene.add(this.controller);
			}
		};
		for (const key in this._sets) {
			if (Object.hasOwnProperty.call(this._sets, key)) {
				this._sets[key](this);
			}
		}
	},
	addColonnes: function (vector3, id) {
		// Encore un cube
		const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, this.floor.size.x);
		const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
		let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		cube.position.set(vector3.x, vector3.y, 0)
		cube.name = "Cube_" + id
		cube.velocity = new THREE.Vector3(0, 0, 0)
		cube.castShadow = true;
		cube.receiveShadow = true;
		this.scene.add(cube);
	},
	addCubes: function () {
		let sizeX = (this.floor.size.x/2) - .5
		let sizeY = (this.floor.size.y/2) - .5
		let x = _formulas.rand(-sizeX, sizeX)
		let y = _formulas.rand(-sizeY, sizeY)
		// Encore un cube
		const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
		const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
		let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		cube.position.set(x, y, .5)
		cube.name = "Cube_"
		cube.velocity = new THREE.Vector3(0, 0, 0)
		cube.castShadow = true;
		cube.receiveShadow = true;
		this.scene.add(cube);
	},
	init: function () {
		this._setThemAll();
	},
};

