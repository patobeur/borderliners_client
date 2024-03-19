import * as THREE from "three";
import { _scene } from "./scenes.js";
import { _model } from "./models.js";
import { Controls } from "./Controls.js";
// import { _movePlayer } from "./movePlayer.js";
export let _players = {
	// models: {
	// 	un: { name: 'un'},
	// 	deux: { name: 'deux' },
	// 	trois: { name: 'trois' },
	// },
	ghostmesh: false,
	player: false,
	players: {},
	counterPlayers: 0,
	init: function (user, callBackFunction) {
		this.Controls = new Controls();
		this.callBackFunction = callBackFunction
		this.addPlayer(user)
	},
	addPlayer: function (user) {

		let mesh = this.getACube(user)
		let group = new THREE.Group()
		group.add(mesh)
		console.log('1234567')
		this.player = {
			user: user,
			mesh: mesh,
			group: group,
			update: () => {
				if (this.player.mesh.position.z > 0.1 + (user.size.z / 2) && this.player.user.datas.status.falling === false) {
					this.player.mesh.position.z -= .1
				}
				this.ghostmesh.position.copy(this.player.mesh.position)
				//console.log('this.ghostmesh.position', this.ghostmesh.position)
				this.player.mesh.checkControls();
			}
		}

		this.ghostmesh = this.player.mesh.clone()
		console.log('####################')
		console.log(this.ghostmesh.position)
		_scene.scene.add(this.ghostmesh)
		// this.ghostmesh.material.transparent = .5
		this.ghostmesh.material.opacity = 0.9;


		let pm = this.player.mesh
		let futur = new THREE.Vector3(0, 0, (this.player.user.size.z / 2)) //futur position
		let actual = this.player.mesh.position
		let speedRatio = this.player.mesh.speedRatio * 1

		this.player.mesh.checkControls = () => {
			// _movePlayer.move(this.player,Controls,this.callBackFunction)
			if (this.Controls.left) futur.x = actual.x - speedRatio;
			if (this.Controls.right) futur.x = actual.x + speedRatio;
			if (this.Controls.up) futur.y = actual.y + speedRatio;
			if (this.Controls.down) futur.y = actual.y - speedRatio;

			if (this.Controls.left || this.Controls.right || this.Controls.up || this.Controls.down) {
				let move = false
				if (futur != actual) {

					let futurPos = new THREE.Vector3(0, 0, 0)
					futurPos.copy(futur)



					let minx = -(_scene.floor.size.x / 2) + (this.player.user.size.x / 2)
					let maxx = (_scene.floor.size.x / 2) - (this.player.user.size.x / 2)
					let miny = -(_scene.floor.size.y / 2) + (this.player.user.size.y / 2)
					let maxy = (_scene.floor.size.y / 2) - (this.player.user.size.y / 2)

					if (
						(futur.x < maxx) &&
						(futur.x > minx)
					) {
						move = true
						this.ghostmesh.position.x = futurPos.x + 0
					}
					if (
						(futur.y < maxy) &&
						(futur.y > miny)
					) {
						move = true
						this.ghostmesh.position.y = futurPos.y + 0
					}


					

					let myMeshBoundingBox = new THREE.Box3().setFromObject(this.ghostmesh);

					if (this.detectCollisions(myMeshBoundingBox) === false) {
						if (move) {
							console.log('move and sending pos', this.ghostmesh.position)
							this.player.mesh.position.copy(this.ghostmesh.position)

							this.player.user.datas.pos.x = this.ghostmesh.position.x + 0
							this.player.user.datas.pos.y = this.ghostmesh.position.y + 0
							this.player.user.datas.pos.z = this.ghostmesh.position.z + 0

							this.callBackFunction.sendPlayerDatas(this.player)
						}
					}
					else {
						this.ghostmesh.position.copy(this.player.mesh.position)
					}
				}
			}
		}
		_scene.scene.add(this.player.mesh);
	},
	removeTeamMate: function (user) {
		this.players[user.id].mesh.geometry.dispose();
		this.players[user.id].mesh.material.dispose();

		_scene.scene.remove(this.players[user.id].mesh);

		delete this.players[user.id]
		this.counterPlayers--
	},
	addTeamMate: function (user) {
		console.log('addTeamMate', user.name, user)
		let mesh = this.getACube(user)
		mesh.checkmove = (datas) => {

		}
		this.counterPlayers++

		let group = new THREE.Group()
		group.add(mesh)

		this.players[user.id] = {
			user: user,
			mesh: mesh,
			group: group
		}
		_scene.scene.add(this.players[user.id].mesh);
	},
	getACube: function (user) {
		// console.log('getACube',user)
		let model = _model.getFinallShape(user)

		const mesh = model.mesh

		mesh.name = 'CUBE_' + user.name;

		user.size = model.size

		// mesh.position.z = model.size.z / 2
		user.datas.pos.z = user.datas.pos.z + (user.size.z / 2)
		mesh.position.z = user.datas.pos.z
		mesh.position.x = user.datas.pos.x
		mesh.position.y = user.datas.pos.y
		//mesh.velocity = new THREE.Vector3(1, 0, 0)

		mesh.rotation.x = (Math.PI / 2)
		mesh.speedRatio = .1
		mesh.hover = false

		// mesh.bbbox = new THREE.Box3().setFromObject(mesh);
		// mesh.bbbox.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );

		mesh.update = (pos) => {
			console.log('moooOTHERooooooooooove', pos)
			let futurPos = new THREE.Vector3(0, 0, 0)
			futurPos.copy(pos)
			mesh.position.x = futurPos.x +0
			mesh.position.y = futurPos.y +0
			mesh.position.z = futurPos.z
			// mesh.bbbox.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );
		}

		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.geometry.computeBoundingBox();
		return mesh
	},
	detectCollisions: function (myMeshBoundingBox) {
		// console.log('myMeshBoundingBox', this.player.mesh.bbbox)
		// console.log('bbbox', this.player.mesh.bbbox)

		let overLapping = false;

		for (const userId in this.players) {
			const player = this.players[userId];
			let otherMeshBoundingBox = new THREE.Box3().setFromObject(player.mesh);
			if (myMeshBoundingBox.intersectsBox(otherMeshBoundingBox)) {
				console.log("Collision détectée avec user " + player.user.name);
				return true
			}
		}
		return overLapping

	},
}