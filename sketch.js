const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
var START = 0;
var PLAY = 1;
var END = 2;
var gameState = START;

var yaSound, seSound, endSound ;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var birdImage, birdGroup;
var backgroundColour;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  birdImage = loadImage("Bird.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  yaSound = loadSound("Yahoo.mp3");
  seSound = loadSound("Tiny-Select.mp3");
  endSound = loadSound("honest.mp3");
}

function setup() {
  var canvas = createCanvas(600, 200);

	engine = Engine.create();
	world = engine.world;

  
  trex = createSprite(50,180, 20, 50, {'friction':0.2, 'density':0.8});
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  
  ground = createSprite(200, 180, 400, 20, {'this.Static': true});
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255, 255, 255);
  
  if(gameState === START){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdGroup.setLifetimeEach(-1);textSize(30);
    stroke("black");
    fill("black");
    textSize(13);
    text("This is a game about a trex who is going to parents house for his birthday.",0, height/2 - 20);
    stroke("black");
    fill("black");
    textSize(13);
    text("To help him go to his parents housepress space to dodge the obstacles.",0, height/2-3);
     stroke("black");
    fill("black");
    textSize(13);
    text("and score him the best birthday of his life",0, height/2+17);
    stroke("black");
    fill("black");
    textSize(13);
    text("Don't hit the obstacles as it will ruin his birthday.",0, height/2+37);
    stroke("black");
    fill("black");
    textSize(23);
    text("Press the Space To Start The Game.",width/2-130, height/2-37);
    stroke("black");
    fill("black");
    textSize(23);
    text("The Story.",width/2-250, height/2-37);
    if(keyWentDown("space") && gameState === START){
      gameState = PLAY;
      seSound.play();
    }
    }
  if (gameState===PLAY){
    stroke("black");
  fill("black");
  text("Score: "+ score, 500,50);
    trex.changeAnimation("running",trex_running);
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      seSound.play();
          }
    trex.velocityY = trex.velocityY + 0.8;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    birds();

    if(cloudsGroup.isTouching(trex)){
      cloudsGroup.destroyEach();
    }

    
    if(obstaclesGroup.isTouching(trex)|| birdGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    if(frameCount % 120 === 0){
    endSound.play();
    }
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function birds() {
  if(score >= 500){
  if(frameCount % 80 === 0){
    var bird = createSprite(1000, 120, 40, 20);
    bird.velocityX = -(6 + 3*score/100);
    bird.y = Math.round(random(80, 120));
    bird.addImage(birdImage);
    bird.scale = 0.3;
    bird.velocityX = ground.velocityX;
    bird.lifetime = 200;
    birdGroup.add(bird);

  }
}
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
async function getBackgroundImg(){
    var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
    var responseJSON = await response.json();

    var datetime = responseJSON.datetime;
    var hour = datetime.slice(11,13);
    
    if(hour>=0600 && hour<=1900){
        background(255, 255, 255);
    }
    else{
        background(150, 150, 255);
    }
}