const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// фон
scene.background = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/planets/starfield.jpg"
);

// 🌍 Земля (КАК БЫЛО — НЕ ТРОГАЛ)
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(3,64,64),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(
            "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
        )
    })
);
scene.add(earth);

// камера
camera.position.set(0, 5, 20);

// контролы
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// точки
const points = [];
const labels = [];
const labelContainer = document.getElementById("labels");

function addPoint(lat, lon, title, content){
    const phi = (90-lat)*Math.PI/180;
    const theta = (lon+180)*Math.PI/180;

    const x = -3*Math.sin(phi)*Math.cos(theta);
    const y = 3*Math.cos(phi);
    const z = 3*Math.sin(phi)*Math.sin(theta);

    const point = new THREE.Mesh(
        new THREE.SphereGeometry(0.12,16,16),
        new THREE.MeshBasicMaterial({color:0x00ffff})
    );

    point.position.set(x,y,z);
    point.userData = {title,content};

    earth.add(point);
    points.push(point);

    const div = document.createElement("div");
    div.className = "label";
    div.innerText = title;

    labelContainer.appendChild(div);
    labels.push({element:div, object:point});
}

// 🔥 ТВОЙ КОНТЕНТ

addPoint(40,-3,"Sobre mí",`
Bienvenido 👋<br><br>
Haré tu negocio más productivo con sitios web a tu gusto 💻<br><br>
Estoy listo para empezar inmediatamente después de tu mensaje 🚀
`);

addPoint(20,30,"Proyectos",`
Creo cualquier sitio web para tu negocio 🚀<br><br>
✔ Landing page<br>
✔ Tienda online<br>
✔ Sitio moderno y rápido<br><br>
Contáctame para empezar 💻
`);

addPoint(-10,100,"Contacto",`
📧 yarogleb2@gmail.com <br><br>

<a href="https://whatsapp.com/dl/" target="_blank" class="link">
<img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="icon">
WhatsApp
</a>
`);

addPoint(0,-120,"Mi vida",`
Mi portafolio 💼<br><br>
Trabajo con clientes creando sitios web únicos y efectivos.<br><br>
Diseño, velocidad y resultados — todo en un solo lugar 🔥
`);

// клик
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click",(e)=>{
    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y = -(e.clientY/window.innerHeight)*2+1;

    raycaster.setFromCamera(mouse,camera);
    const hit = raycaster.intersectObjects(points);

    if(hit.length>0){
        const data = hit[0].object.userData;

        const box = document.getElementById("infoBox");

        document.getElementById("title").innerText = data.title;
        document.getElementById("content").innerHTML = data.content;

        box.classList.remove("hidden");

        box.classList.remove("show");
        void box.offsetWidth;
        box.classList.add("show");
    }
});

// анимация
function animate(){
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    labels.forEach(label => {
        const pos = label.object.getWorldPosition(new THREE.Vector3());
        pos.project(camera);

        const x = (pos.x*0.5+0.5)*window.innerWidth;
        const y = (-pos.y*0.5+0.5)*window.innerHeight;

        label.element.style.left = `${x}px`;
        label.element.style.top = `${y}px`;

        const normal = label.object.getWorldPosition(new THREE.Vector3()).normalize();
        const camDir = camera.position.clone().normalize();

        label.element.style.opacity = normal.dot(camDir) > 0 ? 1 : 0;
    });

    controls.update();
    renderer.render(scene,camera);
}

animate();

// resize
window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});