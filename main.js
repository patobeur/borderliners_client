import { Core } from "./mainCore.js";
const serveur_ip = '192.168.1.138'
const serveur_port = '3500'
const socket = io('ws://'+serveur_ip+':'+serveur_port)
Core.init({socket:socket})