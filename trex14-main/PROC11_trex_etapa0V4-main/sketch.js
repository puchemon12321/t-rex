var PLAY=1;
var END=0;
var gameState=PLAY;
var trex ,trex_running,trex_collided;
var edges;
var ground, groundImg, invisible;
var nubeImg, nubes;
var obs1, obs2, obs3, obs4, obs5, obs6, obstaculos;
var grupoNubes, grupoObs;
var gameOver, restart, gameOverImg, restartImg;
var die, checkpoint, jumpup;
var score=0;


function preload(){
  trex_running=loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  groundImg=loadImage("ground2.png");
  nubeImg=loadImage("cloud.png");
  obs1=loadImage("obstacle1.png");
  obs2=loadImage("obstacle2.png");
  obs3=loadImage("obstacle3.png");
  obs4=loadImage("obstacle4.png");
  obs5=loadImage("obstacle5.png");
  obs6=loadImage("obstacle6.png");
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
die=loadSound("die.mp3");
checkpoint=loadSound("checkpoint.mp3");
jumpup=loadSound("jump.mp3");

}

function setup(){
  createCanvas(windowWidth, windowHeight);
  
  //crear sprite de Trex
 trex=createSprite(100,height-30,20,50);
 trex.addAnimation("running", trex_running);
 trex.addAnimation("collided",trex_collided);
 trex.scale=2;

  //Piso
  ground= createSprite(50, height-30, 600, 20);
  ground.addImage(groundImg);
  invisible=createSprite(50,height-20,600,10);
  invisible.visible=false;

  gameOver=createSprite(width-600,height-450);
  gameOver.addImage(gameOverImg);
  gameOver.scale=2
  gameOver.visible=false;
  
  
  restart= createSprite(width-600,height-300);
  restart.addImage(restartImg);
  restart.scale=1;
  restart.visible=false;

  grupoNubes=createGroup();
  grupoObs= createGroup();

  edges=createEdgeSprites();
}

function draw(){
  background(180);
  textSize(20)
  text("Puntuación: "+ score, 900,30);
  if (gameState === PLAY){
    //velocidad de piso 
    ground.velocityX=-2;

    //Regeneración de piso
    if(ground.x < 0){
      ground.x=ground.width/2;
    }
    if(touches.lenght > 0 ||keyDown("space") && trex.y >=height-300){
    
      trex.velocityY=-22;
      jumpup.play();
      touches=[];
    }

    trex.velocityY=trex.velocityY + 1;
    trex.collide(invisible);

    crearNubes();
    crearObstaculos();

    score=score+Math.round(frameCount/100);

    if (grupoObs.isTouching(trex)){
      die.play();
      gameState=END;
    }

  }else if(gameState === END){
    gameOver.visible=true
    restart.visible=true
    //velocidad de piso 
    ground.velocityX=0;

    //velocidad Trex
    trex.velocityY=0;

    //velocidad obstaculos y nubes
    grupoNubes.setVelocityXEach(0);
    grupoObs.setVelocityXEach(0);
    //tiempo de vida
    grupoNubes.setLifetimeEach(-1);
    grupoObs.setLifetimeEach(-1);
    //cambio de animacion
    trex.changeAnimation("collided")
    if (touches.lenght > 0 ||keyDown("space")){
    reset();
    touches=[];
    }
  }



  
  
  
  

  
  drawSprites();
}


//Función de nubes
function crearNubes(){
  if(frameCount % 60 === 0){
    var nube = createSprite(width,height-500,30,10);
    nube.addImage(nubeImg);
    nube.scale=2;
    nube.y=Math.round(random(60,250));
    nube.velocityX=-3;
    nube.depth=trex.depth;
    trex.depth=trex.depth+3;

    nube.depth=gameOver.depth;
    gameOver.depth=gameOver.depth+3;

    nube.lifetime=450;
    grupoNubes.add(nube);
  }
  
}


//Función de obstaculos
function crearObstaculos(){
  if(frameCount % 100 === 0){
    var obstaculo=createSprite(width,height-65,30,10);
    //obstaculo.addImage(obs1);
    var num = Math.round(random(1,6));
    switch(num){
      case 1:obstaculo.addImage(obs1); break;
      case 2:obstaculo.addImage(obs2); break;
      case 3:obstaculo.addImage(obs3); break;
      case 4:obstaculo.addImage(obs4); break;
      case 5:obstaculo.addImage(obs5); break;
      case 6:obstaculo.addImage(obs6); break;
    }
    obstaculo.scale=1.3;
    obstaculo.velocityX=-12;
    obstaculo.lifetime=300;
    grupoObs.add(obstaculo);
  }
  

}

  
//funcion para reiniciar
function reset(){
  grupoObs.setLifetimeEach(0);
  gameState=PLAY;
  score=0;
  gameOver.visible=false;
  restart.visible=false;
  grupoNubes.setLifetimeEach(0);
  trex.changeAnimation("running");
}
