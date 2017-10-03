var TutorialLevel = function () { };

TutorialLevel.prototype = {
    addLevels: function (text, callback){
        var lvl = game.add.text(30, (this.lvloptions * 50) + 100, text, style.navitem.default);
        lvl.inputEnabled = true;
        lvl.events.onInputUp.add(callback);
        lvl.events.onInputOver.add(function (target) {
            target.setStyle(style.navitem.hover);
        });
        lvl.events.onInputOut.add(function (target) {
            target.setStyle(style.navitem.default);
        });
        this.lvloptions++;
    },
    init: function(){
        
    },

    preload: function(){
        // ASSETS FOR THE LEVEL
        game.load.tilemap('HotLevel2', '/../assets/tilesheet/TutorialLevel.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tilesheetLarge', '/../assets/tilesheet/tilesheetLarge.png');
        // ASSETS FOR THE PLAYER
        game.load.spritesheet('playerSpriteSheet', '/../assets/images/player.png', 128, 128);
        // ASSET FOR ENEMY
        game.load.image('enemyRat', '/../assets/enemies/enemyRat.png', 128, 128);
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
        game.load.image('helpMenu1', '/../assets/images/helpMenu1.png');
        game.load.image('helpMenu2', '/../assets/images/helpMenu2.png');
        game.load.image('helpMenu3', '/../assets/images/helpMenu3.png');
        game.load.image('firebolt', '/../assets/images/firebolt.png');
        game.load.image('waterbolt', '/../assets/images/waterbolt.png');
        game.load.spritesheet('firecircle', '/../assets/images/FireExplosion.png',266,267);
        game.load.spritesheet('explosion', '/../assets/images/explosionSpriteSheet.png',128,120);
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
        game.load.image('tutorial_1', '/../assets/images/tutorialMessage1.png', 128, 128);
        game.load.image('tutorial_2', '/../assets/images/tutorialMessage2.png', 128, 128);
        game.load.image('tutorial_3', '/../assets/images/tutorialMessage3.png', 128, 128);
        game.load.image('tutorial_4', '/../assets/images/tutorialMessage4.png', 128, 128);
        game.load.image('tutorial_5', '/../assets/images/tutorialMessage5.png', 128, 128);
        game.load.image('tutorial_6', '/../assets/images/tutorialMessage6.png', 128, 128);
        // Load Background Music
        game.load.audio('background', ['/../assets/bgm/background.mp3']);
        game.load.audio('explosionSound', ['/../assets/bgm/fire1.wav']);
        game.load.audio('walk', ['/../assets/bgm/walk.mp3']);
        game.load.audio('switch', ['/../assets/bgm/switch.mp3']);
        game.load.audio('ow', ['/../assets/bgm/ow.mp3']);
        //Bengy's Text Box
        game.load.image('bengyTextBox', '/../assets/images/bengyTextBox.png', 128, 128);
        
        // VARIABLES THAT ARE THIS STATE SPECIFIC
        this.animationRunning = false;
        this.timer = game.time.create(false);
        this.spellLearned = false; // used for picking up the spell book
    },
    create: function() {
    
    this.controlState = {state:"", mode:""};
    this.controlState.state = "player";
  
    //Play Background Music        
    this.initializeSound();    
        
    // INITIALIZE THE MAP
    this.initializeMap();   
    
    // Adding the Tutorial Messages
    this.game.add.sprite(500,350,'tutorial_1');        
    this.game.add.sprite(1100,350,'tutorial_2');
    this.game.add.sprite(1700,350,'tutorial_3');
    this.game.add.sprite(2000,850,'tutorial_4');
    this.game.add.sprite(2000,1250,'tutorial_5');
    this.game.add.sprite(2000,1700,'tutorial_6');
        
    // INITIALIZE THE PLAYER
    this.player = this.game.add.sprite(350, 350, 'playerSpriteSheet');
    this.game.physics.arcade.enable(this.player);
    this.addPlayerAnimations();
        
    this.initializeBoss();
    this.bossDefeated = false;    
        
    this.textTimer = game.time.create(false);  
    this.bengyTextBox = this.game.add.sprite(450,450, 'bengyTextBox');    
        
        
    this.welcomeText = "I see you need more training before you begin your adventure...  ";
    
    this.scrollText(this.welcomeText);
    this.bossText = false;
    this.wallText = false;
        
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    //this.game.camera.follow(this.boss);

    this.MonsterTimer = game.time.create(false);    
    this.monsterEnable = true;
    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
         
    
        
    attack_left   = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    attack_right  = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
    this.enemyRat = this.game.add.group();
    this.enemyRat.enableBody = true;
        
    this.vases = this.game.add.group();
    this.vases.immovable = true;
    this.vases.enableBody = true;    
        
    this.vases.create((128*11),(128*17),'vases');
        
    this.thinwall_1 = this.vases.create((2810),(895),'brickWall');
    //this.thinwall_2 = this.vases.create((2810),(895),'brickWall');
    //this.thinwall_3 = this.vases.create((2810),(895),'brickWall');    
        
    this.vases.forEach(function(item){
        item.immovable = true;
        item.body.moves = false;
    }, this);        
          
        
    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.create((128*14),(128*7),'brickWallSquare');
    this.bricks.create((128*14),(128*8),'brickWallSquare');
        this.bricks.create((128*14),(128*9),'brickWallSquare');
        this.bricks.create((128*14),(128*10),'brickWallSquare');
        this.bricks.create((128*14),(128*11),'brickWallSquare');
        this.bricks.create((128*14),(128*12),'brickWallSquare');
        this.bricks.create((128*14),(128*13),'brickWallSquare');
        this.bricks.create((128*14),(128*14),'brickWallSquare');
        this.bricks.create((128*14),(128*15),'brickWallSquare');
    this.bricks.immovable = true;
    this.bricks.forEach(function(item){
        item.immovable = true;
        item.body.moves = false;
    }, this);     
        
    this.exitLadder = this.game.add.sprite(800,1500,'ladder'); this.exitLadder.visible = true;   
        
        
    // SPAWN ENEMIES
    this.createEnemyRatMob(1200,1637);
    this.createEnemyRatMob(500,1486);  
    this.createEnemyRatMob(885,1508);
    this.createEnemyRatMob(300,1540);
    this.createEnemyRatMob(315,2632);
             
        
      this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
      this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
      this.closeTab = game.input.keyboard.addKey(Phaser.Keyboard.K);
      this.helpMenu = game.input.keyboard.addKey(Phaser.Keyboard.H);
        
    this.helpMenuArray = [];
    this.bengySpellScroll = this.game.add.sprite(250,50,'bengySpellScroll');
    this.bengySpellScroll.fixedToCamera = true;    
    this.bengySpellScroll.visible = false;
    this.helpMenu1 = this.game.add.sprite(100,50,'helpMenu2');
    this.helpMenuArray[1] = this.helpMenu1;
    this.helpMenu2 = this.game.add.sprite(100,50,'helpMenu1');
    this.helpMenuArray[0] = this.helpMenu2;
    this.helpMenu1.fixedToCamera = true;
    this.helpMenu2.fixedToCamera = true;
    this.helpMenu1.visible = false;
    this.helpMenu2.visible = false;
    this.helpMenuVisible = false;
    this.helpMenuIndex = 0;
        
       this.helpMenu.onDown.add(function() {
        if(!this.helpMenuVisible){
            this.helpMenuArray[this.helpMenuIndex].visible = true;
            this.helpMenuVisible = true;
        }
        else{
            if(this.helpMenuArray[this.helpMenuIndex + 1]){
                this.helpMenuArray[this.helpMenuIndex].visible = false;
                this.helpMenuIndex++;
                this.helpMenuArray[this.helpMenuIndex].visible = true;
            }
            else{
                this.helpMenuArray[this.helpMenuIndex].visible = false;
                this.helpMenuIndex = 0;
                this.helpMenuVisible = false;
            }
        }
      }, this);  
        
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

    interfaceManager.setPlayer(this.player);    
    interfaceManager.setGame(this.game);
    interfaceManager.setUpHelpMenu();    
    interfaceManager.displayOverlay();  
    interfaceManager.setHealth(5);
    interfaceManager.setEnergy();    

},
   
    playerDied: function(){
        this.player.animations.play('death',10, false,false); 
        this.controlState.state = "dead";
        this.MonsterTimer.loop(1000, this.showDeathText, this);
        this.keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.keyR.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            this.keyR.onDown.removeAll();
            this.mainSound.stop();
            this.setHealth(5);
            this.controlState.state = "player";
            this.game.state.start('Game');
      }, this);
    },
    showDeathText: function(){
           this.game.add.sprite(this.player.x- 400 ,this.player.y - 100,'deathText');
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
                    if(this.controlState.state == "player"){
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
                      this.waterbolt();
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
        interfaceManager.reduceEnergy();
        interfaceManager.reduceEnergy();
        interfaceManager.reduceEnergy();
        console.log(this.player.body.x + " " + this.player.body.y);
        var firecircle = firecircles.getFirstExists(false);
        firecircle.reset(this.player.x-50, this.player.y-50); 
        firecircle.animations.add('explode', [0,1,2,3,4,5,6,7,8], 10, true);
        firecircle.visible = true; 
        firecircle.animations.play('explode',10,false,true);
        },
    firebolt: function() {
        this.fireBlastSound.play();
        interfaceManager.reduceEnergy();
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
        this.fireBlastSound.play();
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

    killRat: function (rat, firebolt) {
        this.fireBlastSound.play();
        this.currentExplosion = this.game.add.sprite(rat.x,rat.y,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        rat.kill();
        firebolt.kill();
    },
    killRat2: function (firecricle, rat) {
        rat.kill();
    },
    killFire: function (firebolt) {
        firebolt.kill();
    },
    killVase: function (vase, firebolt){
        this.fireBlastSound.play();
        this.currentExplosion = this.game.add.sprite(vase.x,vase.y,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        vase.kill();  
        firebolt.kill();
    },
    returnToLevelSelect: function(player, key){
        console.log("returning to level select");
//            this.key1.onDown.removeAll();
//            this.key2.onDown.removeAll();
//            this.key3.onDown.removeAll();
//            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            //this.keyR.onDown.removeAll();
            this.mainSound.stop();
            this.controlState.state = "player";
            this.game.state.start('GameMenu');
    },
    
    update: function() {
    this.checkPlayerMovement();    
    this.checkSpellArray();
    this.checkEnemyAggro();
    this.checkBossState();
    this.bossActOnState();
    this.game.physics.arcade.overlap(this.player, this.enemyRat, this.touchRat, null, this);     
    this.game.physics.arcade.collide(this.enemyRat);
    //for testing purposes
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.player, this.bricks);
    this.game.physics.arcade.collide(this.enemyRat, this.bricks);    
    this.game.physics.arcade.collide(this.player, this.vases);
    this.game.physics.arcade.collide(this.boss, this.blockedLayer);
    this.game.physics.arcade.overlap(firecircles, this.enemyRat, this.killRat2, null, this);
    this.game.physics.arcade.overlap(this.enemyRat, firebolts, this.killRat, null, this);
    this.game.physics.arcade.collide(this.enemyRat, waterbolts, this.killRat, null, this);      
    this.game.physics.arcade.collide(this.boss, this.vases);
    this.game.physics.arcade.collide(this.enemyRat, this.blockedLayer);
    this.game.physics.arcade.collide(firebolts, this.blockedLayer, this.killFire, null, this);
    this.game.physics.arcade.collide(waterbolts, this.blockedLayer, this.killFire, null, this);   
    if(this.player.body.velocity.x > 0 || this.player.body.velocity.x < 0){
        if(this.walking == false){
           this.walk.play();
           this.walking = true;
        }
    }
    if(this.player.body.velocity.x == 0){
        this.walking = false;  
    }
        
        if(this.boss.visible == true){
            this.text.x = Math.floor(this.boss.x - 130);
            this.text.y = Math.floor(this.boss.y - 50);
            this.bengyTextBox.x = Math.floor(this.boss.x - 140);
            this.bengyTextBox.y = Math.floor(this.boss.y - 47);
        }
        
    
    this.game.physics.arcade.overlap(this.vases, firebolts, this.killVase, null, this);
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
    checkPlayerMovement: function(){
    if(this.controlState.state == "player"){
     this.player.body.velocity.x = 0;
     this.player.body.velocity.y = 0;   
 
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
    }    
    }
    else if(this.controlState.state == "bengy"){
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
        console.log(this.boss.x);
        console.log(this.boss.body.velocity.x);
        //this.boss.animations.play('summon',10,false,false);
    },
    controlBengy: function(){
        console.log("controlling bengy");
        if(this.controlState.state == "player"){
            this.controlState.state = "bengy";
            this.game.camera.follow(this.boss);
        }
        else if(this.controlState.state == "bengy"){
            this.controlState.state = "player";
            this.game.camera.follow(this.player);
        }
    },
    bossActOnState: function(){
        if(this.controlState.state == "player"){
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
    initializeSound: function(){
        this.mainSound = game.add.audio('background');
        this.damageSound = game.add.audio('ow');
        this.fireBlastSound = game.add.audio('explosionSound');
        this.walk = game.add.audio('walk');
        this.walk.volume = 1;
        this.walk.repeat = true;
        this.mainSound.play();
        this.walkLoop = new Phaser.Sound(game,'walk',100,true);
        this.walking = false; 
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
        this.textTimer.repeat(100, this.script.length, this.updateText, this);
        this.textTimer.start();
    },
    updateText: function(){
        if(this.script[this.scriptCounter + 1] == " " && this.script[this.scriptCounter] == " "){
        this.bengyTextBox.visible = false;
        this.dialogue = "";
        this.text.destroy();
        this.text = game.add.text(350, 350, this.dialogue, this.style);
        this.textTimer.stop();
        this.return;
        this.scriptCounter = 0;
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
    allowWalkSound : function(){
        this.walking = false;   
    }
}