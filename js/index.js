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
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const textureLoader = new THREE.TextureLoader();
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
const scene = new THREE.Scene();
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
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);
const orbit = new OrbitControls(camera, renderer.domElement);
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);
const sunLight = new THREE.PointLight(0xffffff, 4, 0);
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
const path_of_planets = [];
function createLineLoopWithMesh(radiusX, radiusZ, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  const numSegments = 100; 
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

const genratePlanet = (size, planetTexture, a, b, theta, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();

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

const options = {
  "Real view": true,
  "Show path": true,
  speed: 0.1,
};

// Agrega eventos de cambio a los elementos de HTML
document.getElementById('real-view').addEventListener('change', (e) => {
  options["Real view"] = e.target.checked;
  ambientLight.intensity = e.target.checked ? 0 : 0.5;
});

document.getElementById('show-path').addEventListener('change', (e) => {
  options["Show path"] = e.target.checked;
  path_of_planets.forEach((dpath) => {
    dpath.visible = e.target.checked;
  });
});

document.getElementById('speed').addEventListener('input', (e) => {
  options.speed = parseFloat(e.target.value);
});

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
      planet.rotateY(options.speed * self_rotation_speed);
    }
  );
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


const starsGroup = new THREE.Group();
scene.add(starsGroup);

for (let i = 0; i < 3000; i++) {
  const starGeometry = new THREE.SphereGeometry(0.1, 10, 10);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.x = Math.random() * 700 - 50;
  star.position.y = Math.random() * 700 - 50;
  star.position.z = Math.random() * 700 - 50;
  starsGroup.add(star);
}

let dragging = false;
let mouseDown = false;

renderer.domElement.addEventListener('mousedown', () => {
  mouseDown = true;
});

renderer.domElement.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    dragging = true;
    const mousePosition = new THREE.Vector2();
    mousePosition.x = (e.clientX / window.innerWidth) * 0.5 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 0.5 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(starsGroup.children, true);
    if (intersects.length > 0) {
      intersects.forEach((intersect) => {
        const star = intersect.object;
        star.position.x += (Math.random() - 0.5) * 2;
        star.position.y += (Math.random() - 0.5) * 2;
        star.position.z += (Math.random() - 0.5) * 2;
      });
    }
  }
});

renderer.domElement.addEventListener('mouseup', () => {
  mouseDown = false;
  dragging = false;
});

renderer.domElement.addEventListener('mouseleave', () => {
  mouseDown = false;
  dragging = false;
});


function onclick(event) {
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    var selectedObject = intersects[0].object;
    console.log("UUID del objeto seleccionado:", selectedObject.uuid);
    var planetName = getPlanetName(selectedObject);
    if (planetName !== "Desconocido") {
      createPlanetCard(planetName);
      // Update camera position and orbit controls
      orbit.enabled = false; // Disable orbit controls
      camera.position.set(selectedObject.position.x, selectedObject.position.y + 10, selectedObject.position.z + 20);
      camera.lookAt(selectedObject.position);
      // Create a new orbit controls instance with the planet as the target
      const planetOrbit = new OrbitControls(camera, renderer.domElement);
      planetOrbit.target = selectedObject.position;
      planetOrbit.enabled = true;
    } else {
      var existingCard = document.getElementById('planet-card');
      if (existingCard) {
        existingCard.remove();
      }
    }
  } else {
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
    "SOL\nEstrella\n4.500.000.000 de años\n1.392.000 km de diámetro",
    "MERCURIO" + "\nPlaneta\n4.600.000.000 de años\n4.880 km de diámetro",
    "VENUS \nPlaneta\n4.500.000.000 de años\n12.104 km de diámetro",
    "TIERRA \nPlaneta\n4.500.000.000 de años\n12.742 km de diámetro",
    "MARTE \nPlaneta\n4.600.000.000 de años\n6.779 km de diámetro",
    "JÚPITER \nPlaneta\n4.500.000.000 de años\n139.820 km de diámetro",
    "SATURNO  \nPlaneta\n4.500.000.000 de años\n116.460 km de diámetro",
    "URANO \nPlaneta\n4.500.000.000 de años\n50.724 km de diámetro",
    "NEPTUNO \nPlaneta\n4.500.000.000 de años\n49.244 km de diámetro",
    "PLUTÓN \nPlaneta enano\n4.600.000.000 de años\n2.377 km de diámetro"
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
  var existingCard = document.getElementById('planet-card');
  if (existingCard) {
    existingCard.remove();
  }
  var card = document.createElement('div');
  card.id = 'planet-card';
  card.style.position = 'fixed';
  card.style.left = '15%';
  card.style.top = '38%';
  card.style.transform = 'translate(-50%, -50%)';
  card.style.backgroundColor = 'rgba(34, 34, 34, 0.25)';
  card.style.color = 'red'; // changed to lime color
  card.style.padding = '20px';
  card.style.borderRadius = '5px';
  card.style.zIndex = '1000';
  card.style.fontFamily = 'Montserrat, sans-serif';
  card.style.textAlign = 'left'; // changed to left alignment
  card.style.minWidth = '300px';
  card.style.fontSize = '16px';

  // Split the planetName string into separate lines
  var lines = planetName.split("\n");

  // Create a paragraph element for each line
  for (var i = 0; i < lines.length; i++) {
    var paragraph = document.createElement('p');
    paragraph.textContent = lines[i];
    card.appendChild(paragraph);
  }

  document.body.appendChild(card);
}

renderer.domElement.addEventListener("click", onclick, false);

document.querySelector('nav ul li').addEventListener('mouseover', function() {
  this.querySelector('ul').style.display = 'block';
});

document.querySelector('nav ul li').addEventListener('mouseout', function() {
  this.querySelector('ul').style.display = 'none';
});


document.querySelectorAll('nav ul li ul li a').forEach((element) => {
  element.addEventListener('click', (event) => {
    const planetName = event.target.textContent;
    const planet = planets.find((planet) => planet.planetName === planetName);
    if (planet) {
      camera.lookAt(planet.planetObj.position);
      camera.position.set(planet.planetObj.position.x, planet.planetObj.position.y + 10, planet.planetObj.position.z + 20);
    }
  });
});
