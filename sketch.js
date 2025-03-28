// sketch.js

let dino;
let obstacles = [];
let groundY = 300;

let count = 0;
let label = count;
let classifier;
let video;

let totalJumps = 0;

let movementLabel = '';


function preload(){
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/Ij_wIPp5Q/model.json');
}

preload()

function setup() {
  
  createCanvas(800, 400);
  
  video = createCapture(VIDEO);
  video.hide();

  // Se crea el dino pasándole la posición del suelo
  dino = new Dino(groundY);
  // Se agrega el primer obstáculo
  obstacles.push(new Obstacle(groundY));

  classifyVideo()

}

function classifyVideo(){
  classifier.classify(video, gotResults);
}

function gotResults(error, results){
  if(error){
    console.error(error);
    return;
  }
  
  movementLabel = results[0].label;
  
  setModelGesture();
  classifyVideo();
  console.log(movementLabel)
}

function draw() {
  background(220);

  // Actualizar y dibujar al dinosaurio
  dino.update();
  dino.show();

  textSize(32);
  textAlign(LEFT, TOP)
  text(`Total points: ${label}`, 10, 10);

  // Cada 60 frames se crea un nuevo obstáculo
  if (frameCount % 60 === 0) {
    obstacles.push(new Obstacle(groundY));
  }

  // Actualizar y dibujar cada obstáculo
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    // Si hay colisión, detener el juego
    if (obstacles[i].hits(dino)) {
      console.log("Game Over");
      textSize(20);
      textAlign(CENTER, CENTER);
      text(`Total de saltos acumulados: ${dino.getTotalJumps()}`, 400, 200);
      
      dino.dead();
      noLoop();
    }

    // Eliminar obstáculos que han salido de la pantalla
    if (obstacles[i].offscreen()) {
      textSize(32)
      textAlign(CENTER, CENTER);
      count = count + 1
      label = count      
      obstacles.splice(i, 1);
    }
  }

  // Dibujar la línea del suelo
  stroke(0);
  line(0, groundY, width, groundY);
}

function keyPressed() {
  // Permite saltar con la tecla de espacio o la flecha arriba
  // if (key === ' ' || keyCode === UP_ARROW) {
  //   dino.jump();
  // }
}

function setModelGesture(){
  // Permite saltar con la tecla de espacio o la flecha arriba
  if (movementLabel === 'Jump') {
    dino.jump();
  }
}
