// test to see if this change was added
var Game = function () { };
var spellArray = ['', '', ''];
var keyQ;
var keyW;
var keyE;
var s1T;
var s2T;
var s3T;
var playerStatsArray = ['LV', '', 'MAXHP',
                         'CURMP', 'MAXMP', 'CUREXP', 'MAXEXP'];
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
        game.load.image('heart', '/../assets/images/heart.png', 48, 128);
        // Load Background Music
        game.load.audio('background', ['/../assets/bgm/background.mp3']);
        game.load.audio('explosionSound', ['/../assets/bgm/fire1.wav']);
        game.load.audio('walk', ['/../assets/bgm/walk.mp3']);
        game.load.audio('switch', ['/../assets/bgm/switch.mp3']);
        game.load.audio('ow', ['/../assets/bgm/ow.mp3']);
        
        // VARIABLES THAT ARE THIS STATE SPECIFIC
        this.animationRunning = false;
        this.timer = game.time.create(false);
        this.spellLearned = false; // used for picking up the spell book
    },
    create: function() {
    
    this.controlState = {state:"", mode:""};
    this.controlState.state = "player";
  
    //Play Background Music
    this.mainSound = game.add.audio('background');
    this.damageSound = game.add.audio('ow');
    this.fireBlastSound = game.add.audio('explosionSound');
    this.switchSound = game.add.audio('switch');
    this.switchSoundPlayed = false;
    this.walk = game.add.audio('walk');
    this.walk.volume = 1;
    this.walk.repeat = true;
    this.mainSound.play();
    this.walkLoop = new Phaser.Sound(game,'walk',100,true);
    this.walking = false;
        
    // INITIALIZE THE MAP
    this.initializeMap();   
    
    // INITIALIZE THE PLAYER
    // spawn at the beginning
    //this.player = this.game.add.sprite(1865, 2480, 'playerSpriteSheet');
    // spawn near the boss
    this.player = this.game.add.sprite(350, 350, 'playerSpriteSheet');
    // spawn near the thing corridoor
    //this.player = this.game.add.sprite(2200, 1080, 'playerSpriteSheet');
    //heartlives  
        
    this.game.physics.arcade.enable(this.player);
    this.addPlayerAnimations();
        
    this.initializeBoss();
    this.bossDefeated = false;    
        
    this.initializeVillain();
    this.villainBoss.animations.play('idle');
        
    this.textTimer = game.time.create(false);  
    this.walkTimer = game.time.create(false);
    this.walkTimer.repeat(400, 100000, this.allowWalkSound, this); 
    this.walkTimer.start();
        
    this.welcomeText = "It seems as though you can break the vases with your fireblast... see if you can collect any cool items...  ";
    this.bengyWallText = "it seems as though you are too large to fit through that hole...I wonder how we can ever hit the switch that is on the other side...  ";
    this.bengyBossText = "ahead is the first key-keeper, you need to take him down to escape this dungeon  ";
    
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


    //this.spellbookVase = this.game.add.sprite((128*1),(128*1), 'vases');
        
    this.spellbook = this.vases.create((140*1),(143*1),'spellbook');
    this.vases.create((128*1),(128*1),'vases');
    this.vases.create((128*6),(128*1),'vases');
    this.vases.create((128*6),(128*2),'vases');    
    this.vases.create((128*13),(128*8),'vases');
    this.vases.create((128*14),(128*8),'vases');
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
        
    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.create((2432),(1280),'brickWallSquare');
    this.bricks.create((2560),(1280),'brickWallSquare');   
    this.bricks.immovable = true;
    this.bricks.forEach(function(item){
        item.immovable = true;
        item.body.moves = false;
    }, this);     
        
    var overlay = this.game.add.sprite(0,0,'overlay');
    overlay.fixedToCamera = true;
    this.key = this.game.add.sprite(this.villainBoss.body.x + 200, this.villainBoss.body.y + 200, 'key');
    this.key.visible = false;    
        
    // SPAWN ENEMIES
    this.createEnemyRatMob(1400,200); 
    this.createEnemyRatMob(2000,200);
    this.createEnemyRatMob(2600,200);
    this.createEnemyRatMob(2075,1637);
    this.createEnemyRatMob(1700,1486);  
    this.createEnemyRatMob(885,1508);
    this.createEnemyRatMob(300,1540);
    this.createEnemyRatMob(315,2632);
        
    this.currentLives = 5;
    this.hearts = game.add.group();
    this.setHealth(this.currentLives);      
        
      keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
      keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
      keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
      this.closeTab = game.input.keyboard.addKey(Phaser.Keyboard.K);
      this.helpMenu = game.input.keyboard.addKey(Phaser.Keyboard.H);
        
    this.bengySpellScroll = this.game.add.sprite(250,50,'bengySpellScroll');
    this.bengySpellScroll.fixedToCamera = true;    
    this.bengySpellScroll.visible = false;    
        
       this.helpMenu.onDown.add(function() {
        this.bengySpellScroll.visible = true;
      }, this);  
        
     this.closeTab.onDown.add(function() {
             this.bengySpellScroll.visible = false;
      }, this);
        
        
      keyQ.onDown.add(function() {
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
      keyW.onDown.add(function() {
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
      keyE.onDown.add(function() {
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
    s1T = game.add.text(40, 730, '', { fontSize: '50px', fill: '#000' });
    s2T = game.add.text(130, 730, '', { fontSize: '50px', fill: '#000' });
    s3T = game.add.text(220, 730, '', { fontSize: '50px', fill: '#000' });
    s1T.fixedToCamera = true;
    s2T.fixedToCamera = true;
    s3T.fixedToCamera = true;
    firebolts = game.add.group();
    firebolts.enableBody = true;
    firebolts.physicsBodyType = Phaser.Physics.ARCADE;
    firebolts.createMultiple(20, 'firebolt');

    firecircles = game.add.group();
    firecircles.enableBody = true;
    firecircles.physicsBodyType = Phaser.Physics.ARCADE;
    firecircles.createMultiple(6, 'firecircle');

    this.lv = game.add.text(330, 750, playerStatsArray[0], { fontSize: '10px', fill: '#000' });
    //this.curHP = game.add.text(500, 700, playerStatsArray[1], { fontSize: '10px', fill: '#000' });
    //this.maxHP = game.add.text(600, 700, playerStatsArray[2], { fontSize: '10px', fill: '#000' });
    this.curMP = game.add.text(800, 700, playerStatsArray[3], { fontSize: '10px', fill: '#000' });
    this.maxMP = game.add.text(900, 700, playerStatsArray[4], { fontSize: '10px', fill: '#000' });
    //this.curEXP = game.add.text(600, 750, playerStatsArray[5], { fontSize: '10px', fill: '#000' });
    this.maxEXP = game.add.text(750, 750, playerStatsArray[6], { fontSize: '10px', fill: '#000' });
        
    this.lv.fixedToCamera = true;
    //this.curHP.fixedToCamera = true;
    this.curMP.fixedToCamera = true;
    this.maxMP.fixedToCamera = true;
    //this.maxHP.fixedToCamera = true;
    //this.curEXP.fixedToCamera = true;
    this.maxEXP.fixedToCamera = true;

},
    updateStats: function(){
    this.lv = game.add.text(330, 750, playerStatsArray[0], { fontSize: '10px', fill: '#000' });
    this.curHP = game.add.text(500, 700, playerStatsArray[1], { fontSize: '10px', fill: '#000' });
    this.maxHP = game.add.text(600, 700, playerStatsArray[2], { fontSize: '10px', fill: '#000' });
    this.curMP = game.add.text(800, 700, playerStatsArray[3], { fontSize: '10px', fill: '#000' });
    this.maxMP = game.add.text(900, 700, playerStatsArray[4], { fontSize: '10px', fill: '#000' });
    this.curEXP = game.add.text(600, 750, playerStatsArray[5], { fontSize: '10px', fill: '#000' });
    this.maxEXP = game.add.text(750, 750, playerStatsArray[6], { fontSize: '10px', fill: '#000' });  
    },
    touchRat: function(){
        if(this.monsterEnable == true){
            this.damageSound.play();
            this.hearts.callAll('kill');
            this.currentLives = this.currentLives - 1;
            this.setHealth(this.currentLives);
            

            //  Set a TimerEvent to occur after 2 seconds
            this.MonsterTimer.loop(1000, this.enableMonsters, this);
            this.MonsterTimer.start();
            this.monsterEnable = false;
        }
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
                      this.firebolt();
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
          }
          // outp
          // output what the key combo was, then reset it to empty strings
          spellArray = ['', '', ''];
          // clear the elements that are in the bottom
          elements[0].destroy();
          elements[1].destroy();
          elements[2].destroy();
      }
    // keep running, set current spell letters (UI) to match data
     s1T.text = spellArray[0];
     s2T.text = spellArray[1];
     s3T.text = spellArray[2];
    },
    firecircle: function() {
        console.log(this.player.body.x + " " + this.player.body.y);
        var firecircle = firecircles.getFirstExists(false);
        firecircle.reset(this.player.x-50, this.player.y-50); 
        firecircle.animations.add('explode', [0,1,2,3,4,5,6,7,8], 10, true);
        firecircle.visible = true; 
        firecircle.animations.play('explode',10,false,true);
        },
    firebolt: function() {
        this.fireBlastSound.play();
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

    killRat: function (rat, firebolt) {
        this.fireBlastSound.play();
        this.currentExplosion = this.game.add.sprite(rat.x,rat.y,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        rat.kill();
        firebolt.kill();
    },
    damageBoss: function(villainBoss, firebolt){
        this.fireBlastSound.play();
        this.currentExplosion = this.game.add.sprite(this.villainBoss.x + 50,this.villainBoss.y + 50,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        var health = this.villainState.health;
        health = health - 20;
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
        this.fireBlastSound.play();
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
        if(this.switchSoundPlayed == false){
        this.switchSound.play();
        this.switchSoundPlayed = true;
        }
        this.switches.removeAll();
        this.switches.create((2702),(642),'switchOff');
        this.bricks.removeAll();
    },
    
    
    
    
    update: function() {
    this.checkPlayerMovement();    
    this.checkSpellArray();
    this.checkEnemyAggro();
    this.checkBossState();
    this.bossActOnState();
    this.checkVillainState();
    this.game.physics.arcade.overlap(this.player, this.enemyRat, this.touchRat, null, this);     
    this.game.physics.arcade.collide(this.enemyRat);
    //for testing purposes
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.player, this.bricks);
    this.game.physics.arcade.collide(this.player, this.vases);
    this.game.physics.arcade.collide(this.boss, this.blockedLayer);
    this.game.physics.arcade.overlap(firecircles, this.enemyRat, this.killRat2, null, this);
    this.game.physics.arcade.overlap(this.boss, this.switches, this.turnOnSwitch, null, this);
    this.game.physics.arcade.overlap(this.enemyRat, firebolts, this.killRat, null, this);
    this.game.physics.arcade.overlap(this.villainBoss, firebolts, this.damageBoss, null, this);        
    this.game.physics.arcade.collide(this.boss, this.vases);
    this.game.physics.arcade.collide(this.enemyRat, this.blockedLayer);
    this.game.physics.arcade.collide(firebolts, this.blockedLayer, this.killFire, null, this);
    this.game.physics.arcade.collide(this.player, this.key, this.pickupkey, null, this);    
    if(this.player.body.velocity.x > 0 || this.player.body.velocity.x < 0){
        if(this.walking == false){
           this.walk.play();
           this.walking = true;
           this.walkTimer.start();
        }
    }
    if(this.player.body.velocity.x == 0){
        this.walking = false;  
    }
    if(this.spellLearned == false){
        if(Math.abs(this.spellbook.body.x - this.player.body.x) < 120 && Math.abs(this.spellbook.body.y - this.player.body.y) < 120){   
            this.spellLearned = true;
            console.log("learning spell...");
            this.bengySpellScroll.visible = true;
            this.spellbook.destroy();
        }
    }
    if((this.player.body.x > 1420 && this.player.body.x < 1600) && (this.player.body.y > 2400 && this.player.body.y < 2550)){
        if(this.bossText == false){
            this.scrollText(this.bengyBossText);
            this.bossText = true;
        }
    }
    if((this.player.body.x > 2300 && this.player.body.x < 2500) && (this.player.body.y > 1000 && this.player.body.y < 1200)){
        if(this.wallText == false){
            this.scrollText(this.bengyWallText);
            this.wallText = true;
            console.log("wallText should go");
        }
    }    
//    text to follow player        
//    this.text.x = Math.floor(this.player.x - 130);
//    this.text.y = Math.floor(this.player.y - 30);
        
    // text to follow bengy
        if(this.bossDefeated == true){
            this.text.x = Math.floor(this.villainBoss.x - 130);
            this.text.y = Math.floor(this.villainBoss.y - 30);
        }
        else{
            if(this.boss.visible == true){
            this.text.x = Math.floor(this.boss.x - 130);
            this.text.y = Math.floor(this.boss.y - 30);
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
            velocityX = angleX * 150;
            velocityY = angleY * 150;
            //console.log("rat y: " + velocityY);
            if((this.player.x - this.villainBoss.x) < 0){
                velocityX = -velocityX;  
            }
            
            this.villainBoss.body.velocity.x = velocityX;   
            this.villainBoss.body.velocity.y = velocityY;
        }
        else if((Math.abs(this.player.x+30 - this.villainBoss.x)) <= 110 || (Math.abs(this.player.y+30 - this.villainBoss.y) <= 135)){
            this.villainBoss.animations.play("attack");
            this.villainBoss.body.velocity.x = 0;   
            this.villainBoss.body.velocity.y = 0;
        }
        else{
            this.villainBoss.body.velocity.x = 0;   
            this.villainBoss.body.velocity.y = 0;
        }
        }
        }
        this.timer.start();
        
    },
    checkPlayerMovement: function(){
    if(this.controlState.state == "player"){
     this.player.body.velocity.x = 0;
     this.player.body.velocity.y = 0;   
 
    if(this.game.input.activePointer.isDown){
        if(true){
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
    initializeVillain: function() {
    this.villainBoss = game.add.sprite(2480, 2500, 'villain');
    this.villainBoss.scale.setTo(3,3);
    this.villainState = {state:"", mode:"", health:100};
    this.villainState.state = "moving";
    this.villainState.mode = "easy";
    this.game.physics.arcade.enable(this.villainBoss);    
    this.addVillainAnimations();
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
    this.player.animations.add('idleleft', [2,3], 1,true);
    this.player.animations.add('idleright', [0,1], 1,true);    
    this.player.animations.add('walkleft', [0,1], 6,true);
    this.player.animations.add('walkright', [2,3], 6,true);
    },
    scrollText: function(gameText){
        this.script = "o";
        this.script = gameText;
        console.log(gameText);
        this.scriptCounter = 0;
        this.style = { font: "32px Arial", fill: "#FFFFFF", wordWrap: false, align: "center", backgroundColor: "#ffff00" };
        this.dialogue = "";
        //this.text.destroy();
        this.textLength = 20;
        this.text = game.add.text(350, 350, this.dialogue, this.style);
        this.textTimer.repeat(100, this.script.length, this.updateText, this);
        this.textTimer.start();
    },
    updateText: function(){
        if(this.script[this.scriptCounter + 1] == " " && this.script[this.scriptCounter] == " "){
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
    },
    setHealth: function(lives){
    this.hearts.enableBody = true;
    
    for (var i = 0; i < lives; i++)
    {
        var heart = this.hearts.create(470 + 40*i,700,'heart');
        heart.fixedToCamera = true;
    }
    }
    
}