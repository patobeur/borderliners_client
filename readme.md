# socket io client side

multiple users tests, again...

## start client localy

    open index.html with "Live Server" for client
    
    u'll need to start server side (borderliners_server)


### CLIENT SIDE -> Front imports 

    <script type="importmap">{
        "imports": {
            "three": "https://unpkg.com/three@0.159.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.159.0/examples/jsm/"
    }}
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.min.js" crossorigin="anonymous" referrerpolicy="no-referrer">
    </script>

- [ ] client need to be standAlone as server


### CLIENT SIDE -> add your local server ip to *main.js* 

    import { Core } from "./mainCore.js";
    Core.init({socket:io('ws://192.xxx.xxx.xxx:3500')})


### le top

- un jeu en 3d (vr si possible)

- jouable a plusieurs en local LAN (sauf pour mise à jour (ou plutot version n+) ou autre besoin à la demande sans obligation pour pouvoir participer, à l'ancienne)

- un moyen d'ajouter des add-on

- avec socket.io pour l'instant ( dans le futur dans l'idéal gecko.io qui semble plus rapide)

- ajouter des modèle 3d plus convainquant 

     - juste 3 min (support, tank, dps)
     - ajouter sufisement d'objets pour rendre ca fun !!

- les joueur(euse)s doivent pouvoir : 
    - se déplacer
    - sauter
    - tomber
    - prendre des objets et les mettre dans un inventaire
        - les porter sur eux
        - les consommers
        - les donner
        - ...

    - changer la camera (fps, top view... )
    - changer les touches (qzsd)

    - monter les skills
    - monter de l'xp 
- personnaliser sont avatar

    

