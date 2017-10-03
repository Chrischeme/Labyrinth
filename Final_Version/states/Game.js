// test to see if this change was added
var Game = function () { };
var spellArray = ['', '', ''];
var keyQ;
var keyW;
var keyE;
var s1T;
var s2T;
var s3T;

var elements = [];
var firebolts;
var firecircles;
Game.prototype = {
    
    preload: function(){
        // ASSETS FOR THE LEVEL
        game.load.tilemap('HotLevel2', '/../assets/tilesheet/HotLevel2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tilesheetLarge', '/../assets/tilesheet/tilesheetLarge.png');
        // ASSETS FOR THE PLAYER
        game.load.spritesheet('playerSpriteSheet', '/../assets/images/player.png', 128, 128);
        // ASSET FOR ENEMY
        game.load.image('enemyRat', '/../assets/enemies/enemyRat.png', 128, 128);
        game.load.image('fireRat', '/../assets/enemies/fireRat.png', 128, 128);
        game.load.spritesheet('bengy', '/../assets/enemies/caterpillar.png', 64, 96);
        game.load.spritesheet('villain', '/../assets/enemies/villain_spritesheet.png', 64, 96);
        game.load.spritesheet('bengy', '/../assets/enemies/caterpillar.png', 64, 96);
        // ASSET FOR OVERLAY
        game.load.image('overlay', '/../assets/images/overlay2.png');
        // ASSET FOR ELEMENTS
        game.load.image('elementFire', '/../assets/images/elementFire.png');
        game.load.image('elementWater', '/../assets/images/elementWater.png');
        game.load.image('cosmic', '/../assets/images/cosmic.png');
        // ASSETS FOR SPELLS
        game.load.image('bengySpellScroll', '/../assets/images/bengySpellScroll.png');
        game.load.image('firebolt', '/../assets/images/firebolt.png');
        game.load.image('waterbolt', '/../assets/images/waterbolt.png');
        game.load.spritesheet('firecircle', '/../assets/images/FireExplosion.png',266,267);
        game.load.spritesheet('explosion', '/../assets/images/explosionSpriteSheet.png',128,120);
        game.load.spritesheet('swapAnimation', '/../assets/images/swapAnimation.png',128,128);
        // ASSETS FOR PROPS AND ITEMS
        game.load.image('spellbook', '/../assets/images/spellbook.png', 128, 128);
        game.load.image('vases', '/../assets/images/vases.png', 128, 128);
        game.load.image('brickWall', '/../assets/images/brickWall.png', 48, 128);
        game.load.image('brickWallSquare', '/../assets/images/brickWallSquare.png', 48, 128);
        game.load.image('switchOn', '/../assets/images/switchOn.png', 48, 128);
        game.load.image('switchOff', '/../assets/images/switchOff.png', 48, 128);
        game.load.image('key', '/../assets/images/key.png', 48, 128);
        game.load.image('deathText', '/../assets/images/deathText.png', 48, 128);
        game.load.image('heart', '/../assets/images/heart.png', 48, 128);
        game.load.image('ladder', '/../assets/images/ladder.png', 128, 128);
        
        // VARIABLES THAT ARE THIS STATE SPECIFIC
        this.animationRunning = false;
        this.timer = game.time.create(false);
        this.spellLearned = false; // used for picking up the spell book
    },
    create: function() {
           
    // INITIALIZE THE MAP
    this.initializeMap();   
    
    // INITIALIZE THE PLAYER
    this.player = this.game.add.sprite(350, 350, 'playerSpriteSheet');
    this.game.physics.arcade.enable(this.player);
    this.addPlayerAnimations();
    
    this.initializeManagers();
        
    //Play Background Music        
    soundManager.initializeSound();
    soundManager.playBackgroundMusic();
        
    this.initializeBoss();
    this.bossDefeated = false;    
        
    this.initializeVillain();
        
    this.textTimer = game.time.create(false);  
    this.bengyTextBox = this.game.add.sprite(450,450, 'bengyTextBox'); 
        
    this.recentText = "";    
        
    this.welcomeText = "It seems as though you can break the vases with your fireblast...  ";
    this.bengyWallText = "it appears you are too large to fit through that hole...I wonder how we can ever hit the switch  ";
    this.bengyBossText = "ahead is the first key-keeper, you need to take him down to escape this dungeon  ";
        
    this.scrollText(this.welcomeText);
    this.recentText = this.welcomeText;    
    this.bossText = false;
    this.wallText = false;
        
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    //this.game.camera.follow(this.boss);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
         
    
        
    attack_left   = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    attack_right  = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
    this.enemyRat = this.game.add.group();
    this.enemyRat.enableBody = true;
    this.fireRat = this.game.add.group();
    this.fireRat.enableBody = true;    
    this.fireRat.create((1320),(760),'fireRat');    
        
    this.vases = this.game.add.group();
    this.vases.immovable = true;
    this.vases.enableBody = true;    

    this.waterText = false;

    //this.spellbookVase = this.game.add.sprite((128*1),(128*1), 'vases');
        
    this.spellbook = this.vases.create((128*19),(143*1),'spellbook');
    this.vases.create((128*19),(128*1),'vases');
    this.vases.create((128*6),(128*1),'vases');
    this.vases.create((128*6),(128*2),'vases');    
    this.vases.create((128*13),(128*9),'vases');
    this.thinwall_2 = this.vases.create((128*13),(128*8),'brickWall');
    this.thinwall_3 = this.vases.create((128*13),(128*8),'brickWall');
    //create fires to be put out
    //this.wallExplosion = this.game.add.sprite(8*128,6*128,'explosion');
    //this.wallExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
    //this.wallExplosion.animations.play('explode',10, true,true);
        
        
    this.vases.create((128*12),(128*15),'vases');
    this.vases.create((128*13),(128*15),'vases');
    this.vases.create((128*11),(128*10),'vases');
    this.vases.create((128*11),(128*9),'vases');
    this.vases.create((128*11),(128*16),'vases');
    this.vases.create((128*11),(128*17),'vases');
        
    this.thinwall_1 = this.vases.create((2810),(895),'brickWall');
    //this.thinwall_2 = this.vases.create((2810),(895),'brickWall');
    //this.thinwall_3 = this.vases.create((2810),(895),'brickWall');    
        
    this.vases.forEach(function(item){
        item.immovable = true;
        item.body.moves = false;
    }, this);        
        
    this.switches = this.game.add.group();
    this.switches.immovable = true;
    this.switches.enableBody = true;
    this.switches.create((2702),(642),'switchOn');
        
    this.switches2 = this.game.add.group();
    this.switches2.immovable = true;
    this.switches2.enableBody = true;
    this.switches2.create(8*128,8*128,'switchOn');    
        
    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.create((2432),(1280),'brickWallSquare');
    this.bricks.create((2560),(1280),'brickWallSquare');   
    this.bricks.immovable = true;
    this.bricks.forEach(function(item){
        item.immovable = true;
        item.body.moves = false;
    }, this);     
        
    this.exitLadder = this.game.add.sprite(23*128,16*128,'ladder'); this.exitLadder.visible = false;   
        
    this.key = this.game.add.sprite(this.villainBoss.body.x + 200, this.villainBoss.body.y + 200, 'key');
    this.key.visible = false;
    this.secondBrick = false; 
        
    // SPAWN ENEMIES
    this.createEnemyRatMob(1400,200); 
    this.createEnemyRatMob(2000,200);
    this.createEnemyRatMob(2600,200);
    this.createEnemyRatMob(2075,1637);
    this.createEnemyRatMob(1700,1486);
    // this ones we want to change to have a mix of rats    
    this.enemyRat.create(840,1600 ,'enemyRat');
    this.fireRat.create(790,1374  ,'fireRat');
    this.enemyRat.create(590,1240 ,'enemyRat');
    this.fireRat.create(231,820   ,'fireRat');
    this.enemyRat.create(217,1225 ,'enemyRat');
    this.fireRat.create(246,1556  ,'fireRat');    
    this.enemyRat.create(330,822  ,'enemyRat');
    this.fireRat.create(259,2710  ,'fireRat');    
    this.enemyRat.create(445,2738 ,'enemyRat');
    this.fireRat.create(842,2878  ,'fireRat');    
    this.enemyRat.create(1149,2878,'enemyRat');
        
        
      this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
      this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
      this.closeTab = game.input.keyboard.addKey(Phaser.Keyboard.K);
        
    this.bengySpellScroll = this.game.add.sprite(250,50,'bengySpellScroll');
    this.bengySpellScroll.fixedToCamera = true;    
    this.bengySpellScroll.visible = false;
         
        
     this.closeTab.onDown.add(function() {
             for(var i = 0 ; i < this.helpMenuArray.size; i++){
                     this.helpMenuArray[i].visible = false;  
                }
      }, this);
        
        
      this.keyQ.onDown.add(function() {
          if (spellArray[0] === '') {
              spellArray[0] = 'Q';
              this.elementFire = this.game.add.sprite(10,711,'elementFire'); 
              this.elementFire.fixedToCamera = true;
              elements[0] = this.elementFire;
              //this.elements.create((10),(711),'elementFire');
          }
          else if (spellArray[1] === '') {
              spellArray[1] = 'Q';
              this.elementFire = this.game.add.sprite(100,711,'elementFire'); 
              this.elementFire.fixedToCamera = true;
              elements[1] = this.elementFire;
          }
          else if (spellArray[2] === '') {
              spellArray[2] = 'Q';
              this.elementFire = this.game.add.sprite(190,711,'elementFire'); 
              this.elementFire.fixedToCamera = true;
              elements[2] = this.elementFire;
          }
      }, this);
      this.keyW.onDown.add(function() {
        if (spellArray[0] === '') {
              spellArray[0] = 'W';
              this.elementFire = this.game.add.sprite(10,711,'elementWater'); 
              this.elementFire.fixedToCamera = true;
              elements[0] = this.elementFire;
          }
          else if (spellArray[1] === '') {
              spellArray[1] = 'W';
              this.elementFire = this.game.add.sprite(100,711,'elementWater'); 
              this.elementFire.fixedToCamera = true;
              elements[1] = this.elementFire;
          }
          else if (spellArray[2] === '') {
              spellArray[2] = 'W';
              this.elementFire = this.game.add.sprite(190,711,'elementWater'); 
              this.elementFire.fixedToCamera = true;
              elements[2] = this.elementFire;
          }
      }, this);
      this.keyE.onDown.add(function() {
        if (spellArray[0] === '') {
              spellArray[0] = 'E';
              this.elementFire = this.game.add.sprite(10,711,'cosmic'); 
              this.elementFire.fixedToCamera = true;
              elements[0] = this.elementFire;
          }
          else if (spellArray[1] === '') {
              spellArray[1] = 'E';
              this.elementFire = this.game.add.sprite(100,711,'cosmic'); 
              this.elementFire.fixedToCamera = true;
              elements[1] = this.elementFire;
          }
          else if (spellArray[2] === '') {
              spellArray[2] = 'E';
              this.elementFire = this.game.add.sprite(190,711,'cosmic'); 
              this.elementFire.fixedToCamera = true;
              elements[2] = this.elementFire;
          }
      }, this);
        
    firebolts = game.add.group();
    firebolts.enableBody = true;
    firebolts.physicsBodyType = Phaser.Physics.ARCADE;
    firebolts.createMultiple(20, 'firebolt');
        
    waterbolts = game.add.group();
    waterbolts.enableBody = true;
    waterbolts.physicsBodyType = Phaser.Physics.ARCADE;
    waterbolts.createMultiple(20, 'waterbolt');    

    firecircles = game.add.group();
    firecircles.enableBody = true;
    firecircles.physicsBodyType = Phaser.Physics.ARCADE;
    firecircles.createMultiple(6, 'firecircle');

    this.addCheatButtons();
        
    interfaceManager.displayOverlay();  
    interfaceManager.setHealth(5);
    interfaceManager.setEnergy();

},
    touchRat: function(){
        if(playerStateManager.getState() != "death"){
            interfaceManager.playerTakeDamage();
            if(interfaceManager.getCurrentLives() <= 0){
                this.playerDied();   
            }
            console.log();
        }
    },
    touchFireRat: function(){
        if(playerStateManager.getState() != "death"){
            interfaceManager.playerTakeDamage();
            this.boss.body.x = this.player.x - 90;
            this.boss.body.y = this.player.y + 20;
        
            this.currentSwap = this.game.add.sprite(this.player.x - 105,this.player.y + 20,'swapAnimation');
            this.currentSwap.animations.add('swap', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
            this.currentSwap.animations.play('swap',20, false,true);
            if(interfaceManager.getCurrentLives() <= 0){
                this.playerDied();
            }
            
        }
    },
    playerDied: function(){
        if(playerStateManager.getState() != "death"){
            console.log("running");
        this.player.animations.play('death',10, false,false); 
        playerStateManager.deathState();
        this.boss.body.velocity.x = 0;
        this.boss.body.velocity.y = 0;
        
        this.keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
        this.keyR.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            this.keyR.onDown.removeAll();
            playerStateManager.playerState();
            interfaceManager.setCurrentLives(5);
            soundManager.stopBackgroundMusic();
            this.game.state.start('Game');
      }, this);
        this.keyB.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            this.keyR.onDown.removeAll();
            playerStateManager.playerState();
            interfaceManager.setCurrentLives(5);
            soundManager.stopBackgroundMusic();
            this.game.state.start('LevelSelect1');
      }, this);    
    }
    },
    getPlayer: function(){
        return this.player();   
    },
    enableMonsters: function(){
           this.monsterEnable = true;
    },
    
    checkEnemyAggro: function(){
        for (var i = 0, len = this.enemyRat.children.length; i<len; i++) {
            if (Math.abs((this.player.x - this.enemyRat.children[i].x)) < 400 && Math.abs((this.player.y - this.enemyRat.children[i].y)) < 400){
            ratDistancex = this.player.x - this.enemyRat.children[i].x;
            ratDistancey = this.player.y - this.enemyRat.children[i].y;
            totalDistanceAway = Math.sqrt(ratDistancex*ratDistancex + ratDistancey*ratDistancey);
            angleY = Math.sin(ratDistancey/totalDistanceAway);
            angleX = Math.cos(ratDistancex/totalDistanceAway);
            velocityX = angleX * 80;
            velocityY = angleY * 80;
            //console.log("rat y: " + velocityY);
            if((this.player.x - this.enemyRat.children[i].x) < 0){
                velocityX = -velocityX;  
            }
            
            this.enemyRat.children[i].body.velocity.x = velocityX;   
            this.enemyRat.children[i].body.velocity.y = velocityY;
        }
        }
        for (var i = 0, len = this.fireRat.children.length; i<len; i++) {
            if (Math.abs((this.boss.x - this.fireRat.children[i].x)) < 400 && Math.abs((this.boss.y - this.fireRat.children[i].y)) < 400){
            ratDistancex = this.boss.x - this.fireRat.children[i].x;
            ratDistancey = this.boss.y - this.fireRat.children[i].y;
            totalDistanceAway = Math.sqrt(ratDistancex*ratDistancex + ratDistancey*ratDistancey);
            angleY = Math.sin(ratDistancey/totalDistanceAway);
            angleX = Math.cos(ratDistancex/totalDistanceAway);
            velocityX = angleX * 80;
            velocityY = angleY * 80;
            //console.log("rat y: " + velocityY);
            if((this.boss.x - this.fireRat.children[i].x) < 0){
                velocityX = -velocityX;  
            }
            
            this.fireRat.children[i].body.velocity.x = velocityX;   
            this.fireRat.children[i].body.velocity.y = velocityY;
        }
        }
    },
    calculateFollowVelocity: function(playerx, playery, ratx, raty){
        return 100;
    },
    checkSpellArray: function() {
        // if spellArray (our 3 key combos) fill up, run this 
      if (spellArray[2] != '') {
          // if statements that check what the key combo was (if QQQ --> firebolt())
          if (spellArray[0] === 'Q') {
              if (spellArray[1] === 'Q') {
                  if (spellArray[2] === 'Q') {
                    if(playerStateManager.getState() == "player"){
                        this.firebolt();
                    }
                    }
                  else if(spellArray[2] === 'W'){
                      this.firecircle();
                  }
                  
              }
          }
          if (spellArray[0] === 'E') {
              if (spellArray[1] === 'E') {
                 if (spellArray[2] === 'E') {
                      //this.summonBengy();
                  }
                  else if(spellArray[2] === 'W'){
                      //this.firecircle();
                  }
                  else if(spellArray[2] === 'Q'){
                      this.controlBengy();
                  }
                  
              }
          }
          if (spellArray[0] === 'W') {
              if (spellArray[1] === 'E') {
                 if (spellArray[2] === 'W') {
                      this.summonBengy();
                  }
                  else if(spellArray[2] === 'W'){
                      //this.firecircle();
                  }
                  else if(spellArray[2] === 'Q'){
                      //this.controlBengy();
                  }
                  
              }
              else if (spellArray[1] === 'W'){
                   if (spellArray[2] === 'W'){
                       if(playerStateManager.getState() == "bengy"){
                          this.waterbolt();
                   }
                  }    
              }
          }
          // outp
          // output what the key combo was, then reset it to empty strings
          spellArray = ['', '', ''];
          // clear the elements that are in the bottom
          elements[0].destroy();
          elements[1].destroy();
          elements[2].destroy();
      }
    },
    firecircle: function() {
        if(interfaceManager.getEnergyCount() < 3){
            return;   
        }
        interfaceManager.reduceEnergy();
        interfaceManager.reduceEnergy();
        interfaceManager.reduceEnergy();
        
        soundManager.explosionSound();
        console.log(this.player.body.x + " " + this.player.body.y);
        var firecircle = firecircles.getFirstExists(false);
        firecircle.reset(this.player.x-50, this.player.y-50); 
        firecircle.animations.add('explode', [0,1,2,3,4,5,6,7,8], 10, true);
        firecircle.visible = true; 
        firecircle.animations.play('explode',10,false,true);
        },
    firebolt: function() {
        if(interfaceManager.getEnergyCount() == 0){
            return;   
        }
        interfaceManager.reduceEnergy();  
        soundManager.explosionSound();  
        var firebolt = firebolts.getFirstExists(false);
        if (firebolt) {
        firebolt.reset(this.player.body.x + 64, this.player.body.y + 64);
        firebolt.lifespan = 2000;
        game.physics.enable(firebolt, Phaser.Physics.ARCADE);
        firebolt.rotation = game.physics.arcade.angleToPointer(firebolt, this.game.input.activePointer);
        firebolt.body.velocity.x = Math.cos(firebolt.rotation) * 400;
        firebolt.body.velocity.y = Math.sin(firebolt.rotation) * 400;
//        console.log(this.player.x);
//        console.log(this.player.y);
        // cast animation
            if(this.game.input.mousePointer.worldX - this.player.x < 0){
        this.player.animations.play('attack_left',10,false,false);
        this.animationRunning = true;
        this.timer.repeat(500, 0,this.stopTimer, this);
        this.timer.start();
            }
            else{
         this.player.animations.play('attack_right',10,false,false);
        this.animationRunning = true;
        this.timer.repeat(500, 0,this.stopTimer, this);
        this.timer.start(); 
            }
        }    
    },
    waterbolt: function() {
        soundManager.explosionSound();
        var waterbolt = waterbolts.getFirstExists(false);
        if (waterbolt) {
        waterbolt.reset(this.boss.body.x + 30, this.boss.body.y + 30);
        waterbolt.lifespan = 2000;
        game.physics.enable(waterbolt, Phaser.Physics.ARCADE);
        waterbolt.rotation = game.physics.arcade.angleToPointer(waterbolt, this.game.input.activePointer);
        waterbolt.body.velocity.x = Math.cos(waterbolt.rotation) * 400;
        waterbolt.body.velocity.y = Math.sin(waterbolt.rotation) * 400;

            if(this.game.input.mousePointer.worldX - this.player.x < 0){
        this.player.animations.play('attack_left',10,false,false);
        this.animationRunning = true;
        this.timer.repeat(500, 0,this.stopTimer, this);
        this.timer.start();
            }
            else{
         this.player.animations.play('attack_right',10,false,false);
        this.animationRunning = true;
        this.timer.repeat(500, 0,this.stopTimer, this);
        this.timer.start(); 
            }
        }    
    },
    playSwitchSound: function(){
      soundManager.playSwitchSound();  
    },
    killRat: function (rat, firebolt) {
        soundManager.explosionSound();
        this.currentExplosion = this.game.add.sprite(rat.x,rat.y,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        rat.kill();
        firebolt.kill();
    },
    fizzleShot: function(rat, firebolt){
        soundManager.explosionSound();
        this.currentExplosion = this.game.add.sprite(rat.x,rat.y-50,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        firebolt.kill();
    },
    damageBoss: function(villainBoss, firebolt){
        soundManager.explosionSound();
        this.currentExplosion = this.game.add.sprite(this.villainBoss.x + 50,this.villainBoss.y + 50,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        var health = this.villainState.health;
        health = health - 12;
        this.villainState.health = health;
        
        console.log(this.villainState.health);
        firebolt.kill();
    },
    killRat2: function (firecricle, rat) {
        rat.kill();
    },
    killFire: function (firebolt) {
        firebolt.kill();
    },
    killVase: function (vase, firebolt){
        soundManager.explosionSound();
        this.currentExplosion = this.game.add.sprite(vase.x,vase.y,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        vase.kill();  
        firebolt.kill();
    },
    pickupkey : function(player, key){   
        this.key.visible = false;
        console.log("key picked up");
    },
    killspellbookvase: function (){
        console.log("spell cast");
        this.spellbookVase.setVisible(false);
    },
    pickupspellbook: function (){
        console.log("picked up");
        this.spellbook.kill();
        
    },
    turnOnSwitch: function(){
        soundManager.playSwitchSound();
        this.switches.removeAll();
        this.switches.create((2702),(642),'switchOff');
        this.bricks.removeAll();
        this.lastBrick = this.bricks.create((8*128),(13*128),'brickWallSquare');
        this.lastBrick.immovable = true;
        this.lastBrick.body.moves = false;
        this.secondBrick = true;

    },
    turnOnSwitch2: function(){
        if(this.switchSoundPlayed == false){
        soundManager.playSwitchSound();
        this.switchSoundPlayed = true;
        }
        this.switches2.removeAll();
        this.switches2.create(8*128,8*128,'switchOff');
        this.lastBrick.destroy();
        soundManager.playSwitchSound();
        //this.bricks.removeAll();
    },
    killFireWall: function (rat, firebolt) {
        this.fireBlastSound.play();
        this.currentExplosion = this.game.add.sprite(rat.x,rat.y,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        rat.kill();
        firebolt.kill();
    },
    test: function(){   
        console.log("test");
    },
    returnToLevelSelect: function(player, key){
        console.log("returning to level select");
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            //this.keyR.onDown.removeAll();
            //this.setHealth(5);
            playerStateManager.playerState();
            soundManager.stopBackgroundMusic();
            this.game.state.start('LevelSelect2');
    },
    
    update: function() {
    playerStateManager.playerUpdate();
    this.checkPlayerMovement();    
    this.checkSpellArray();
    this.checkEnemyAggro();
    this.checkBossState();
    this.bossActOnState();
    this.checkVillainState();
    // Rat Collisions
    this.game.physics.arcade.overlap(this.player, this.enemyRat, this.touchRat, null, this);
    this.game.physics.arcade.collide(this.enemyRat);  
    this.game.physics.arcade.overlap(firecircles, this.enemyRat, this.killRat2, null, this);    
    this.game.physics.arcade.overlap(this.enemyRat, firebolts, this.killRat, null, this);
    this.game.physics.arcade.overlap(this.enemyRat, waterbolts, this.fizzleShot, null, this);    
    this.game.physics.arcade.collide(this.enemyRat, this.blockedLayer);
    // Fire Rat Collisions
    this.game.physics.arcade.overlap(this.player, this.fireRat, this.touchRat, null, this);    
    this.game.physics.arcade.collide(this.fireRat, waterbolts, this.killRat, null, this);
    this.game.physics.arcade.collide(this.fireRat, firebolts, this.fizzleShot, null, this);    
    this.game.physics.arcade.overlap(this.boss, this.fireRat, this.touchFireRat, null, this);
    this.game.physics.arcade.collide(this.fireRat, this.blockedLayer);    
        
    //for testing purposes
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.player, this.bricks);
    this.game.physics.arcade.collide(this.player, this.vases);
    this.game.physics.arcade.collide(this.boss, this.blockedLayer);
    this.game.physics.arcade.overlap(this.boss, this.switches, this.turnOnSwitch, null, this);
    this.game.physics.arcade.overlap(this.boss, this.switches2, this.turnOnSwitch2, null, this);
    // to kill fire rats        
    this.game.physics.arcade.overlap(this.villainBoss, firebolts, this.damageBoss, null, this);        
    this.game.physics.arcade.collide(this.boss, this.vases);    
    this.game.physics.arcade.collide(firebolts, this.blockedLayer, this.killFire, null, this);
    this.game.physics.arcade.collide(waterbolts, this.blockedLayer, this.killFire, null, this);
        

        
    if(this.player.body.velocity.x > 0 || this.player.body.velocity.x < 0){
        soundManager.playWalkSound();
    }
    if(this.player.body.velocity.x == 0){
        this.walking = false;  
    }
    if(this.spellLearned == false){
        if(Math.abs(this.spellbook.body.x - this.player.body.x) < 120 && Math.abs(this.spellbook.body.y - this.player.body.y) < 120){   
            this.spellLearned = true;
            console.log("learning spell...");
            this.spellbook.destroy();
            this.bengySpellFoundText = "Hey you learned a new spell!!!... Press H to look through your spell book!  ";
            this.recentText = this.bengySpellFoundText;
            this.scrollText(this.bengySpellFoundText);
            interfaceManager.addSpell('helpMenu3');
            interfaceManager.addSpell('helpMenu4');
        }
    }
    if((this.player.body.x > 1420 && this.player.body.x < 1600) && (this.player.body.y > 2400 && this.player.body.y < 2550)){
        if(this.bossText == false){
            this.scrollText(this.bengyBossText);
            this.bossText = true;
            this.recentText  = this.bengyBossText;
        }
    }
    if((this.player.body.x > 2300 && this.player.body.x < 2500) && (this.player.body.y > 1000 && this.player.body.y < 1200)){
        if(this.wallText == false){
            this.scrollText(this.bengyWallText);
            this.recentText  = this.bengyWallText;
            this.wallText = true;
            console.log("wallText should go");
        }
    }    
    if((this.player.body.x > 2317 && this.player.body.x < 2646) && (this.player.body.y > 1390 && this.player.body.y < 1430)){
        if(this.waterText == false){
            this.bengyWaterRemindText = "I now know how to use water blast, im sure that will come in handy soon  ";
            this.scrollText(this.bengyWaterRemindText);
            this.recentText  = this.bengyWaterRemindText;
            this.waterText = true;
            console.log("wallText should go");
        }
    }      
        // text to follow bengy
        if(this.bossDefeated == true){
            this.text.x = Math.floor(this.villainBoss.x - 120);
            this.text.y = Math.floor(this.villainBoss.y - 40);
            this.bengyTextBox.x = Math.floor(this.villainBoss.x - 157);
            this.bengyTextBox.y = Math.floor(this.villainBoss.y - 47);
        }
        else{
            if(this.boss.visible == true){
            this.text.x = Math.floor(this.boss.x - 130);
            this.text.y = Math.floor(this.boss.y - 50);
            this.bengyTextBox.x = Math.floor(this.boss.x - 145);
            this.bengyTextBox.y = Math.floor(this.boss.y - 50);
            }
        }
        
    
    this.game.physics.arcade.overlap(this.vases, firebolts, this.killVase, null, this);
    this.game.physics.arcade.overlap(this.spellbookVase, this.player, this.killspellbookvase, null, this);
    if(this.animationRunning == false){
        
    }
        
    // sprite movement animations    
    
        
    if(attack_left.isDown){
        this.player.animations.play('attack_left',10,false,false);
        this.animationRunning = true;
        this.timer.repeat(500, 0,this.stopTimer, this);
        this.timer.start();
    }
    if(attack_right.isDown){
        this.player.animations.play('attack_right',10,false,false);
        this.animationRunning = true;
        this.timer.repeat(500, 0,this.stopTimer, this);
        this.timer.start();
    }
        
    if((Math.abs(this.player.x - this.key.x) < 50) && (Math.abs(this.player.y - this.key.y) < 50)){
        this.pickupkey(2,2);   
    }
     if((Math.abs(this.player.x - this.exitLadder.x) < 50) && (Math.abs(this.player.y - this.exitLadder.y) < 50)){
        this.returnToLevelSelect();   
    }    
        
        
    },
    stopTimer: function() {
        this.animationRunning = false;
    },
    checkBossState: function(){
        if(this.player.body.x - this.boss.body.x < 300 && this.player.body.y - this.boss.body.y < 300){
            this.bengy.state = ("attack");
        }
    },
    checkVillainState: function(){
        if(this.villainState.health <= 0 && this.bossDefeated == false){
            this.bossDefeated = true;
            this.villainBoss.animations.play("death", 10, true, true);
            this.villainDefeatedText = "I cannot believe this... You have defeated me in battle...I am so embarrassed... you will never make it past the next key-keeper! Have your first etheral key!!!!..  ";
            this.scrollText(this.villainDefeatedText);
            this.villainBoss.body.velocity.x = 0;
            this.villainBoss.body.velocity.y = 0;
            this.key.x = this.villainBoss.body.x + 200;
            this.key.x = this.villainBoss.body.x + 200; 
            this.key.visible = true;
            this.exitLadder.visible = true;
        }
        else if(this.villainState.health > 0){
        if((Math.abs(this.player.x - this.villainBoss.x)) < 375 && (Math.abs(this.player.y - this.villainBoss.y)) < 375 || this.villainState.health < 100){
            this.villainState.state = "follow";   
        }
        if(this.villainState.state == "follow"){
            if((Math.abs(this.player.x+30 - this.villainBoss.x)) > 75 || (Math.abs(this.player.y+30 - this.villainBoss.y) > 130)){
            this.villainBoss.animations.play("walk", 10, true, true);  
            ratDistancex = this.player.x - this.villainBoss.x;
            ratDistancey = this.player.y - this.villainBoss.y;
            totalDistanceAway = Math.sqrt(ratDistancex*ratDistancex + ratDistancey*ratDistancey);
            angleY = Math.sin(ratDistancey/totalDistanceAway);
            angleX = Math.cos(ratDistancex/totalDistanceAway);
            velocityX = angleX * 90;
            velocityY = angleY * 90;
            //console.log("rat y: " + velocityY);
            if((this.player.x - this.villainBoss.x) < 0){
                velocityX = -velocityX;  
            }
            
            this.villainBoss.body.velocity.x = velocityX;   
            this.villainBoss.body.velocity.y = velocityY;
        }
        else if((Math.abs(this.player.x+30 - this.villainBoss.x)) <= 110 || (Math.abs(this.player.y+30 - this.villainBoss.y) <= 135)){
            if(playerStateManager.getState() != "death"){
            this.villainBoss.animations.play("attack");
            interfaceManager.playerTakeDamage();
            if(interfaceManager.getCurrentLives() <= 0){
                this.villainBoss.animations.stop();
                this.playerDied();   
            }
            this.villainBoss.body.velocity.x = 0;   
            this.villainBoss.body.velocity.y = 0;
        }
        else{
            this.villainBoss.body.velocity.x = 0;   
            this.villainBoss.body.velocity.y = 0;
        }
        }
        }
        }
        this.timer.start();
        
    },
    checkPlayerMovement: function(){
    if(playerStateManager.getState() == "player"){
    if(this.game.input.activePointer.isDown){
        game.physics.arcade.moveToPointer(this.player,250);
        if(this.animationRunning == false){
            if(this.player.body.velocity.x < 0){
                this.player.animations.play('walkleft');
            }
            else{
                this.player.animations.play('walkright');
            }    
        }
        if(Math.abs(this.game.input.mousePointer.worldX - (this.boss.x + 35)) < 20 && Math.abs(this.game.input.mousePointer.worldY - (this.boss.y + 45)) < 60){
            if(soundManager.switchSoundAvailable){
                soundManager.switchSoundAvailable = false;
                this.helpText = "Press H to look through your spells if you are stuck  ";
                this.scrollText(this.recentText);
                console.log("bengy speaks");
            }
        }
        
    }    
    }
    else if(playerStateManager.getState() == "bengy"){
     this.boss.body.velocity.x = 0;
     this.boss.body.velocity.y = 0;
     this.player.body.velocity.x = 0;
     this.player.body.velocity.y = 0;

    if(this.cursors.up.isDown) {
      if(this.boss.body.velocity.y == 0)
      this.boss.body.velocity.y -= 250;
    }
    else if(this.cursors.down.isDown) {
      if(this.boss.body.velocity.y == 0)
      this.boss.body.velocity.y += 250;
    }
    else {
      this.boss.body.velocity.y = 0;
    }
        
    if(this.cursors.left.isDown) {
      this.boss.body.velocity.x -= 250;
        if(this.animationRunning == false){
            
        }
      console.log("test");
    }
    else if(this.cursors.right.isDown) {
      this.boss.body.velocity.x += 250;
        if(this.animationRunning == false){
               
        }
    }
    else{

    }  
    if(this.game.input.activePointer.isDown){
       game.physics.arcade.moveToPointer(this.boss,250);  
         
    }      
    }    
    },
    initializeBoss: function() {
    this.boss = game.add.sprite(300, 300, 'bengy');
    this.bengy = {state:"", mode:""};
    this.bengy.state = "moving";
    this.bengy.mode = "easy";
    this.game.physics.arcade.enable(this.boss);    
    this.addBossAnimations(); 
    this.boss.animations.play('idle',10,true,true);
    //this.boss.visible = true;
    },
    summonBengy: function(){
        this.boss.body.x = this.player.x - 90;
        this.boss.body.y = this.player.y + 20;
        
        this.currentSwap = this.game.add.sprite(this.player.x - 105,this.player.y + 20,'swapAnimation');
        this.currentSwap.animations.add('swap', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentSwap.animations.play('swap',20, false,true);
        
        //this.boss.animations.play('summon',10,false,false);
    },
    controlBengy: function(){
        if(playerStateManager.getState() == "player"){
            interfaceManager.reduceEnergy();
            playerStateManager.bengyState();
            this.game.camera.follow(this.boss);
            
            
            this.currentSwap = this.game.add.sprite(this.boss.x-30,this.boss.y-10,'swapAnimation');
            this.currentSwap.animations.add('swap', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
            this.currentSwap.animations.play('swap',20, false,true);
            
        }
        else if(playerStateManager.getState() == "bengy"){
            interfaceManager.reduceEnergy();
            playerStateManager.playerState();
            this.game.camera.follow(this.player);
            
            this.currentSwap = this.game.add.sprite(this.player.x,this.player.y,'swapAnimation');
            this.currentSwap.animations.add('swap', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
            this.currentSwap.animations.play('swap',20, false,true);
        }
    },
    initializeVillain: function() {
    this.villainBoss = game.add.sprite(2480, 2500, 'villain');
    this.villainBoss.scale.setTo(3,3);
    this.villainState = {state:"", mode:"", health:100};
    this.villainState.state = "moving";
    this.villainState.mode = "easy";
    this.game.physics.arcade.enable(this.villainBoss);    
    this.addVillainAnimations();
    this.villainBoss.animations.play('idle');    
    },
    bossActOnState: function(){
        if(playerStateManager.getState() == "player"){
        if((Math.abs(this.player.x+30 - this.boss.x)) > 105 || (Math.abs(this.player.y+30 - this.boss.y) > 130)){
            ratDistancex = this.player.x - this.boss.x;
            ratDistancey = this.player.y - this.boss.y;
            totalDistanceAway = Math.sqrt(ratDistancex*ratDistancex + ratDistancey*ratDistancey);
            angleY = Math.sin(ratDistancey/totalDistanceAway);
            angleX = Math.cos(ratDistancex/totalDistanceAway);
            velocityX = angleX * 250;
            velocityY = angleY * 250;
            //console.log("rat y: " + velocityY);
            if((this.player.x - this.boss.x) < 0){
                velocityX = -velocityX;  
            }
            
            this.boss.body.velocity.x = velocityX;   
            this.boss.body.velocity.y = velocityY;
        }
        else{
            this.boss.body.velocity.x = 0;   
            this.boss.body.velocity.y = 0;
        }
    }
    },
    initializeMap: function() {
    this.map = this.game.add.tilemap('HotLevel2');
    // First Parameter is the name of the tilesheet given in the tilesheet file and the second one is the specified name of the tilesheet given in the assets section
    this.map.addTilesetImage('tilesheetLarge', 'tilesheetLarge');
    this.backgroundlayer = this.map.createLayer('walkable');
    this.backgroundlayer.resizeWorld();
    this.blockedLayer = this.map.createLayer('blocked');
    this.map.setCollisionBetween(1, 2000, true, 'blocked');
    },
    createEnemyRatMob: function(x,y){
        this.enemyRat.create((x-200),(y+150),'enemyRat');
        this.enemyRat.create((x+200),(y+150),'enemyRat');
        this.enemyRat.create(x,y,'enemyRat');
    },
    
    addBossAnimations:function() {
    //  Our two animations, walking left and right.
    this.boss.animations.add('left', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 10, true);
    this.boss.animations.add('right', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], 10, true);
    this.boss.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    this.boss.animations.add('attack_left', [34, 35, 36, 37, 38, 39, 40, 41, 42, 43], 10, true);
    this.boss.animations.add('attack_right', [44, 45, 46, 47, 48, 49, 50, 51, 52, 53], 10, true);
    this.boss.animations.add('death', [54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65], 10, true);
    this.boss.animations.add('summon', [65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 1], 10, true);    
    this.boss.animations.add('damage_left', [66, 67, 68, 69, 70, 71, 73], 10, true);
    this.boss.animations.add('damage_right', [74, 75, 76, 77, 78, 79, 80, 81], 10, true);
    this.boss.animations.add('jump_left', [82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
    this.boss.animations.add('jump_right', [91, 92, 93, 94, 95, 96, 97, 98, 99], 10, true);   
    },
    addVillainAnimations: function(){
        this.villainBoss.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        this.villainBoss.animations.add('walk', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
        this.villainBoss.animations.add('attack', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
        this.villainBoss.animations.add('jump', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 10, true);
        this.villainBoss.animations.add('damage', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, true);
        this.villainBoss.animations.add('death', [50, 51, 52, 53, 54, 55, 56], 10, true);
        
    },
    addPlayerAnimations: function(){
    this.player.animations.add('attack_left', [7,8,9,10,11,12,13,13,13], 10, true);
    this.player.animations.add('attack_right', [14,15,16,17,18,19,20,20,20], 10, true);
    this.player.animations.add('death', [21,22,23,24,25,26,27], 10, true);    
    this.player.animations.add('idleleft', [2,3], 1,true);
    this.player.animations.add('idleright', [0,1], 1,true);    
    this.player.animations.add('walkleft', [0,1], 6,true);
    this.player.animations.add('walkright', [2,3], 6,true);
    },
    scrollText: function(gameText){
        if(this.text){
            this.text.destroy();
        }
        this.bengyTextBox.visible = true;
        this.script = "o";
        this.script = gameText;
        console.log(gameText);
        this.scriptCounter = 0;
        this.style = { font: "32px Arial", fill: "#000000", wordWrap: false, align: "center", backgroundColor: "#ffff00" };
        this.dialogue = "";
        //this.text.destroy();
        this.textLength = 20;
        this.text = game.add.text(350, 350, this.dialogue, this.style);
        this.textTimer.repeat(75, this.script.length, this.updateText, this);
        this.textTimer.start();
    },
    addCheatButtons: function(){
    this.key1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.key1.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            soundManager.stopBackgroundMusic();
            this.game.state.start('Game');
    }, this);
    this.key2 = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.key2.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            soundManager.stopBackgroundMusic();
            this.game.state.start('Level2');
    }, this);
    this.key3 = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.key3.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            soundManager.stopBackgroundMusic();
            this.game.state.start('Game4');
    }, this);
    this.key4 = game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.key4.onDown.add(function() {
        console.log("going to level selet");
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            soundManager.stopBackgroundMusic();
            this.game.state.start('LevelSelect');
    }, this);   
    },
    updateText: function(){
        if(this.script[this.scriptCounter + 1] == " " && this.script[this.scriptCounter] == " "){
        this.dialogue = "";
        this.text.destroy();
        this.text = game.add.text(200, 350, this.dialogue, this.style);
        this.textTimer.stop();
        this.return;
        this.scriptCounter = 0;
        this.bengyTextBox.visible = false;    
        }
        else{
        this.text.destroy();
        this.dialogue = this.dialogue + this.script[this.scriptCounter];
        if(this.scriptCounter > this.textLength && this.script[this.scriptCounter] == " "){
         this.dialogue = "";
         this.textLength = this.textLength + 28;
        }
        this.scriptCounter++;
        this.text = game.add.text(350, 350, this.dialogue, this.style);
        }
    },
    initializeManagers: function(){  
        playerStateManager.setPlayer(this.player);    
        playerStateManager.setGame(this.game);
        interfaceManager.setPlayer(this.player);    
        interfaceManager.setGame(this.game);
        interfaceManager.setUpHelpMenu();
        soundManager.setPlayer(this.player);    
        soundManager.setGame(this.game);
    }
}