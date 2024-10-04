//Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
const datos = {
  "Mercury": {
      "a": 0.38709843,
      "e": 0.20563661,
      "i": 7.00559432,
      "long_peri": 48.33961819,
      "long_node": 77.45771895
  },
  "Venus": {
      "a": 0.72332102,
      "e": 0.00676399,
      "i": 3.39777545,
      "long_peri": 76.67261496,
      "long_node": 131.76755713
  },
  "EMBary": {
      "a": 1.00000018,
      "e": 0.01673163,
      "i": -0.00054346,
      "long_peri": -5.11260389,
      "long_node": 102.93005885
  },
  "Mars": {
      "a": 1.52371243,
      "e": 0.09336511,
      "i": 1.85181869,
      "long_peri": 49.71320984,
      "long_node": -23.91744784
  },
  "Jupiter": {
      "a": 5.20248019,
      "e": 0.04853590,
      "i": 1.29861416,
      "long_peri": 100.29282654,
      "long_node": 14.27495244
  },
  "Saturn": {
      "a": 9.54149883,
      "e": 0.05550825,
      "i": 2.49424102,
      "long_peri": 113.63998702,
      "long_node": 92.86136063
  },
  "Uranus": {
      "a": 19.18797948,
      "e": 0.04685740,
      "i": 0.77298127,
      "long_peri": 73.96250215,
      "long_node": 172.43404441
  },
  "Neptune": {
      "a": 30.06952752,
      "e": 0.00895439,
      "i": 1.77005520,
      "long_peri": 131.78635853,
      "long_node": 46.68158724
  }
}
//////////////////////////////////////
//NOTE Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
//NOTE import all texture
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");
//////////////////////////////////////



//////////////////////////////////////
//NOTE Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////

//////////////////////////////////////
//NOTE screen bg
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
]);
scene.background = cubeTexture;
//////////////////////////////////////

//////////////////////////////////////
//NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);
////////////////////////////////////

//////////////////////////////////////
//NOTE Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 0);
scene.add(sunLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radiusX, radiusZ, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the elliptical path
  const numSegments = 100; // Number of segments to create the elliptical path
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radiusX * Math.cos(angle);
    const z = radiusZ * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}
//////////////////////////////////////

/////////////////////////////////////
//NOTE: create planet
const genratePlanet = (size, planetTexture, a, b, theta, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();

  // Calculate x and z coordinates for the planet's position on the ellipse
  const x = a * Math.cos(theta);
  const z = b * Math.sin(theta);

  planet.position.set(x, 0, z);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, z);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(a, b, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
};

const planets = [
  {
    ...genratePlanet(3.2, mercuryTexture, datos.Mercury.a * 100, datos.Mercury.a * Math.sqrt(1- (datos.Mercury.e * datos.Mercury.e)) * 100, 0), // Multiply by 100 to make it visible in the model
    rotaing_speed_around_sun: 149472.67411175 / 1000000, // Divide by a large number to slow it down
    self_rotation_speed: 149472.67411175 / 1000000, // Divide by a large number to slow it down
  },
  {
    ...genratePlanet(5.8, venusTexture, datos.Venus.a * 100, datos.Venus.a * Math.sqrt(1- (datos.Venus.e * datos.Venus.e)) * 100, 0), // Multiply by 100 to make it visible in the model
    rotaing_speed_around_sun: 58517.81538729 / 1000000,
    self_rotation_speed: 58517.81538729 / 1000000,
  },
  {
    ...genratePlanet(6, earthTexture, datos.EMBary.a * 100, datos.EMBary.a * Math.sqrt(1- (datos.EMBary.e * datos.EMBary.e)) * 100, 0), // Multiply by 100 to make it visible in the model
    rotaing_speed_around_sun: 35999.37244981 / 1000000,
    self_rotation_speed: 35999.37244981 / 1000000,
  },
  {
    ...genratePlanet(4, marsTexture, datos.Mars.a * 100, datos.Mars.a * Math.sqrt(1- (datos.Mars.e * datos.Mars.e)) * 100, 0), // Multiply by 100 to make it visible in the model
    rotaing_speed_around_sun: 19140.30268499 / 1000000,
    self_rotation_speed: 19140.30268499 / 1000000,
  },
  {
    ...genratePlanet(12, jupiterTexture, datos.Jupiter.a * 100, datos.Jupiter.a * Math.sqrt(1- (datos.Jupiter.e * datos.Jupiter.e)) * 100, 0),
    rotaing_speed_around_sun: 3034.74612775 / 1000000,
    self_rotation_speed: 3034.74612775 / 1000000,
  },
  {
    ...genratePlanet(10, saturnTexture, datos.Saturn.a * 100, datos.Saturn.a * Math.sqrt(1- (datos.Saturn.e * datos.Saturn.e)) * 100, 0,{
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }),
    rotaing_speed_around_sun: 1222.49362201 / 1000000,
    self_rotation_speed: 1222.49362201 / 1000000,
  },
  {
    ...genratePlanet(7, uranusTexture, datos.Uranus.a *100, datos.Uranus.a * Math.sqrt(1- (datos.Uranus.e * datos.Uranus.e)) * 100, 0, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }),
    rotaing_speed_around_sun: 428.48202785 / 1000000,
    self_rotation_speed: 428.48202785 / 1000000,
  },
  {
    ...genratePlanet(7, neptuneTexture, datos.Uranus.a * 100, datos.Uranus.a * Math.sqrt(1- (datos.Uranus.e * datos.Uranus.e)) * 100, 0), // Multiply by 100 to make it visible in the model
    rotaing_speed_around_sun: 218.45945325 / 1000000,
    self_rotation_speed: 218.45945325 / 1000000,
  },
];
//////////////////////////////////////

//////////////////////////////////////
//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms")*1
gui.add(options, "speed", 0, maxSpeed?maxSpeed:20);

//////////////////////////////////////

//////////////////////////////////////
//NOTE - animate function
// Inicializa el ángulo theta para cada planeta
planets.forEach(planet => {
  planet.theta = 0;
});
let i = 0;
function animate(time) {
  sun.rotateY(options.speed * 0.004);
  planets.forEach(
    ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
      i++;
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      //planetObj.position.x = planetObj.position.x + i;;
      planet.rotateY(options.speed * self_rotation_speed);
    }
  );
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


//////////////////////////////////////

//////////////////////////////////////
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//////////////////////////////////////

function onclick(event) {
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  
  // Ajustar las coordenadas del mouse al canvas de Three.js
  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    var selectedObject = intersects[0].object;
    console.log("UUID del objeto seleccionado:", selectedObject.uuid);
    
    var planetName = getPlanetName(selectedObject);
    createPlanetCard(planetName);
  } else {
    // Si no se hizo clic en ningún planeta, eliminar la tarjeta existente
    var existingCard = document.getElementById('planet-card');
    if (existingCard) {
      existingCard.remove();
    }
  }
}

function getPlanetName(object) {
  var planetTextures = [
    sunTexture,
    mercuryTexture,
    venusTexture,
    earthTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    uranusTexture,
    neptuneTexture,
    plutoTexture
  ];

  var planetNames = [
    "Sol",
    "Mercurio",
    "Venus",
    "Tierra",
    "Marte",
    "Júpiter",
    "Saturno",
    "Urano",
    "Neptuno",
    "Plutón"
  ];

  for (var i = 0; i < planetTextures.length; i++) {
    if (object.material && object.material.map &&
        planetTextures[i].image.src === object.material.map.image.src) {
      return planetNames[i];
    }
  }

  return "Desconocido";
}

function createPlanetCard(planetName) {
  // Eliminar la tarjeta existente si hay alguna
  var existingCard = document.getElementById('planet-card');
  if (existingCard) {
    existingCard.remove();
  }

  // Crear la nueva tarjeta
  var card = document.createElement('div');
  card.id = 'planet-card';
  card.style.position = 'fixed';
  card.style.left = '50%';
  card.style.top = '10%';
  card.style.transform = 'translate(-50%, -50%)';
  card.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  card.style.color = 'white';
  card.style.padding = '20px';
  card.style.borderRadius = '20px';
  card.style.zIndex = '1000';
  card.style.fontFamily = 'Arial, sans-serif';
  card.style.textAlign = 'center';
  card.style.minWidth = '300px';
  card.style.fontSize = '24px';
  
  // Añadir el nombre del planeta a la tarjeta
  card.textContent = `Planeta: ${planetName}`;
  
  document.body.appendChild(card);
}

// Asegúrate de que esto esté fuera de cualquier función
renderer.domElement.addEventListener("click", onclick, false);