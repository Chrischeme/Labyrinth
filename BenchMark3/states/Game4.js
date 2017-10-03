var Game4 = function () { };
var spellArray = ['', '', ''];
var keyQ;
var keyW;
var keyE;
var s1T;
var s2T;
var s3T;
var playerStatsArray = ['1', 100, '100',
                         100, '100', '0', '1000'];
var elements = [];
var firebolts;
var firecircles;
Game4.prototype = {
    
    preload: function(){
        this.game.state.remove("LevelSelect");
        //game.load.tilemap('tutorial_map', '/../assets/tilesheet/tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('Level4', '/../assets/tilesheet/Level4.json', null, Phaser.Tilemap.TILED_JSON);
        //game.load.image('tilesheet', '/../assets/tilesheet/tilesheet.png');
        game.load.image('tilesheet', '/../assets/tilesheet/tilesheet.png');
        //game.load.image('player', '/../assets/images/player.png');
        game.load.spritesheet('playerSpriteSheet', '/../assets/images/player.png', 128, 128);
        game.load.image('enemyRat', '/../assets/enemies/enemyRat.png', 128, 128);
        game.load.image('overlay', '/../assets/images/overlay2.png');
        game.load.image('elementFire', '/../assets/images/elementFire.png');
        game.load.image('elementWater', '/../assets/images/elementWater.png');
        game.load.image('firebolt', '/../assets/images/firebolt.png');
        game.load.image('vases', '/../assets/images/vases.png', 128, 128);
        game.load.image('spellbook', '/../assets/images/spellbook.png', 128, 128);
        game.load.spritesheet('firecircle', '/../assets/images/FireExplosion.png',266,267);
        this.animationRunning = false;
        this.timer = game.time.create(false);

        game.load.spritesheet('explosion', '/../assets/images/explosionSpriteSheet.png',128,120);
        game.load.audio('background4', ['/../assets/bgm/background4.mp3']);
        game.load.audio('explosionSound', ['/../assets/bgm/fire1.wav']);
        game.load.audio('walk', ['/../assets/bgm/walk.mp3']);
        
    },
    createEnemyRatMob: function(x,y){
        this.enemyRat.create((x-200),(y+150),'enemyRat');
        this.enemyRat.create((x+200),(y+150),'enemyRat');
        this.enemyRat.create(x,y,'enemyRat');
    },
    create: function() {
        this.mainSound = game.add.audio('background4');
    this.fireBlastSound = game.add.audio('explosionSound');
    this.walk = game.add.audio('walk');
    this.walk.volume = 1;
    this.walk.repeat = true;
    this.mainSound.play();
    this.walkLoop = new Phaser.Sound(game,'walk',100,true);
    this.walkLoop.play();
    this.walking = false;
    this.spellLearned = false; // used for picking up the spell book
        this.elementFire = this.game.add.sprite(10,711,'elementFire');
        this.elements = this.game.add.group();    
        
        this.map = this.game.add.tilemap('Level4');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        //this.map.addTilesetImage('HotLevel2', 'tilesheet');
        this.map.addTilesetImage('tilesheet', 'tilesheet');

        //create layer
        this.backgroundlayer = this.map.createLayer('BackgroundLayer');
        this.blockedLayer = this.map.createLayer('BlockedLayer');
        this.objectLayer = this.map.createLayer('ObjectLayer');
        
            this.map.setCollisionBetween(1, 2000, true, 'BlockedLayer');
        //    this.map.setCollisionBetween(1, 2000, true, 'ObjectLayer');
        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();

        this.player = this.game.add.sprite(200, 200, 'playerSpriteSheet');
        this.game.physics.arcade.enable(this.player);

        //the camera will follow the player in the world
        this.game.camera.follow(this.player);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.player.animations.add('attack_left', [7,8,9,10,11,12,13,13,13], 10, true);
        this.player.animations.add('attack_right', [14,15,16,17,18,19,20,20,20], 10, true);
        this.player.animations.add('idleleft', [2,3], 1,true);
        this.player.animations.add('idleright', [0,1], 1,true);    
        this.player.animations.add('walkleft', [0,1], 6,true);
        this.player.animations.add('walkright', [2,3], 6,true);         
    
        
        attack_left   = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        attack_right  = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
        this.enemyRat = this.game.add.group();
        this.enemyRat.enableBody = true;
        
        //this.vases = this.game.add.group();
        //this.vases.immovable = true;
        //this.vases.enableBody = true;    


        //this.spellbookVase = this.game.add.sprite((128*1),(128*1), 'vases');
        
        //this.spellbook = this.vases.create((140*1),(143*1),'spellbook');
        //this.vases.create((128*1),(128*1),'vases');
        //this.vases.create((128*6),(128*1),'vases');
        //this.vases.create((128*6),(128*2),'vases');
        //this.spellbook = this.game.add.sprite((140*1),(143*1), 'spellbook');
        
        //this.vases.forEach(function(item){
        //    console.log("this executed");
        //    item.immovable = true;
        //    item.body.moves = false;
        //}, this);        
        
        //this.createEnemyRatMob(1000,400);
        //this.createEnemyRatMob(2310,390);
        //this.createEnemyRatMob(1400,875);
        //this.createEnemyRatMob(2500,1630);
        //this.createEnemyRatMob(795,1830);
        var overlay = this.game.add.sprite(0,0,'overlay');
        overlay.fixedToCamera = true;
        //Player Health System & Mana & Exp
        this.healthBar = this.add.sprite(460, 706, 'healthBar');
        this.manaBar = this.add.sprite(790, 706, 'manaBar');
        this.expBar = this.add.sprite(500, 760, 'expBar');
        //this.maxHealth = this.add.sprite(0, 0, 'healthBar');
        //this.healthBar.anchor.setTo(0, 1);
        this.healthBar.scale.setTo(1, 2.2);
        this.manaBar.scale.setTo(1, 2.2);
        this.expBar.scale.setTo(2, 2.2);
        //Not Sure what anchor really does...
        //this.maxHealth.anchor.setTo(0, 1);
        //this.maxHealth.alpha = 0.5;
        this.healthBar.fixedToCamera = true;
        this.manaBar.fixedToCamera = true;
        this.expBar.fixedToCamera = true;

        //this.maxHealth.fixedtoCamera = true;

        
        keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
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
            }
            else if (spellArray[1] === '') {
                spellArray[1] = 'E';
            }
            else if (spellArray[2] === '') {
                spellArray[2] = 'E';
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
        this.curHP = game.add.text(500, 700, playerStatsArray[1], { fontSize: '10px', fill: '#000' });
        this.maxHP = game.add.text(600, 700, playerStatsArray[2], { fontSize: '10px', fill: '#000' });
        this.curMP = game.add.text(800, 700, playerStatsArray[3], { fontSize: '10px', fill: '#000' });
        this.maxMP = game.add.text(900, 700, playerStatsArray[4], { fontSize: '10px', fill: '#000' });
        this.curEXP = game.add.text(600, 750, playerStatsArray[5], { fontSize: '10px', fill: '#000' });
        this.maxEXP = game.add.text(750, 750, playerStatsArray[6], { fontSize: '10px', fill: '#000' });
        this.lv.fixedToCamera = true;
        this.curHP.fixedToCamera = true;
        this.curMP.fixedToCamera = true;
        this.maxMP.fixedToCamera = true;
        this.maxHP.fixedToCamera = true;
        this.curEXP.fixedToCamera = true;
        this.maxEXP.fixedToCamera = true;   

        this.createEnemyRatMob(1400,200); 
        this.createEnemyRatMob(2000,200);
        this.createEnemyRatMob(2600,200);
        this.createEnemyRatMob(2075,1637);
        this.createEnemyRatMob(1700,1486);  
        this.createEnemyRatMob(885,1508);
        this.createEnemyRatMob(300,1540);
        this.createEnemyRatMob(315,2632);
        this.walkTimer = game.time.create(false);
        this.walkTimer.repeat(400, 100000, this.allowWalkSound, this); 
        this.walkTimer.start();
},
allowWalkSound : function(){
        this.walking = false;   
    },
    touchRat: function(){
        //playerStatsArray[1] = playerStatsarray[1] - 10;
    },
    checkEnemyAggro: function(){
        for (var i = 0, len = this.enemyRat.children.length; i<len; i++) {
            if (Math.abs((this.player.x - this.enemyRat.children[i].x)) < 400){
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
                      elements[0].destroy();
                      elements[1].destroy();
                      elements[2].destroy();
                    }
                  else if(spellArray[2] === 'W'){
                      this.firecircle();
                  }
                  
              }
          }
          // output what the key combo was, then reset it to empty strings
          spellArray = ['', '', ''];
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
        var firecircle = firecircles.getFirstExists(false);
        firecircle.reset(this.player.x-50, this.player.y-50); 
        firecircle.animations.add('explode', [0,1,2,3,4,5,6,7,8], 10, true);
        firecircle.visible = true; 
        firecircle.animations.play('explode',10,false,true);
        },
    firebolt: function() {
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
    killRat2: function (firecricle, rat) {
        rat.kill();
    },
    killFire: function (firebolt) {
        firebolt.kill();
    },
    killVase: function (vase, firebolt){
        vase.kill();  
        firebolt.kill();
    },
    killspellbookvase: function (){
        console.log("spell cast");
        this.spellbookVase.setVisible(false);
    },
    pickupspellbook: function (){
        console.log("picked up");
        this.spellbook.kill();
        
    },
    checkTeleporters: function() {
        var bodyX = this.player.body.x + 64;
        var bodyY = this.player.body.y + 64;
        if (bodyX > 512 && bodyX < 640 && bodyY > 128 && bodyY < 256) {
            this.player.body.x = 256;
            this.player.body.y = 512;
        }
        if (bodyX > 128 && bodyX < 256 && bodyY > 512 && bodyY < 640) {
            this.player.body.x = 640;
            this.player.body.y = 128;
        }
        if (bodyX > 384 && bodyX < 512 && bodyY > 1408 && bodyY < 1536) {
            this.player.body.x = 1024;
            this.player.body.y = 128;
        }
        if (bodyX > 896 && bodyX < 1024 && bodyY > 128 && bodyY < 256) {
            this.player.body.x = 512;
            this.player.body.y = 1408;
        }
        if (bodyX > 1664 && bodyX < 1792 && bodyY > 128 && bodyY < 256) {
            this.player.body.x = 2176;
            this.player.body.y = 1536;
        }
        if (bodyX > 2048 && bodyX < 2176 && bodyY > 1536 && bodyY < 1664) {
            this.player.body.x = 1792;
            this.player.body.y = 128;
        }
        if (bodyX > 2816 && bodyX < 2944 && bodyY > 128 && bodyY < 256) {
            this.player.body.x = 896;
            this.player.body.y = 2304;
        }
        if (bodyX > 768 && bodyX < 896 && bodyY > 2304 && bodyY < 2432) {
            this.player.body.x = 2944;
            this.player.body.y = 128;
        }
        if (bodyX > 1408 && bodyX < 1536 && bodyY > 2944 && bodyY < 3072) {
            this.player.body.x = 1920;
            this.player.body.y = 1792;
        }
        if (bodyX > 1792 && bodyX < 1920 && bodyY > 1792 && bodyY < 1920) {
            this.player.body.x = 1536;
            this.player.body.y = 2944;
        }
    },
    update: function() {
    this.checkSpellArray();
    this.checkEnemyAggro();    
    this.checkTeleporters();
    this.game.physics.arcade.overlap(this.player, this.enemyRat, this.touchRat, null, this);     
    this.game.physics.arcade.collide(this.enemyRat);
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.player, this.vases);
    this.game.physics.arcade.collide(this.enemyRat, this.blockedLayer);
    this.game.physics.arcade.collide(firebolts, this.blockedLayer, this.killFire, null, this);
    
        
        
    this.game.physics.arcade.overlap(firecircles, this.enemyRat, this.killRat2, null, this);
    
    this.game.physics.arcade.overlap(this.enemyRat, firebolts, this.killRat, null, this);
    this.game.physics.arcade.overlap(this.vases, firebolts, this.killVase, null, this);
    this.game.physics.arcade.overlap(this.spellbookVase, this.player, this.killspellbookvase, null, this);
    if(this.animationRunning == false){
        if(this.player.body.velocity.x < 0){
            this.player.animations.play('walkleft');
        }
        else{
            this.player.animations.play('walkright');
        }
    }
    // sprite movement animations    
        if(this.player.body.velocity.x > 0 || this.player.body.velocity.x < 0){
        if(this.walking == false){
           this.walk.play();
           this.walking = true;
           this.walkTimer.start();
        }
        console.log("should play sound");
    }
    if(this.player.body.velocity.x == 0){
        this.walking = false;  
    }
    this.player.body.velocity.x = 0;

    if(this.cursors.up.isDown) {
      if(this.player.body.velocity.y == 0)
      this.player.body.velocity.y -= 250;
    }
    else if(this.cursors.down.isDown) {
      if(this.player.body.velocity.y == 0)
      this.player.body.velocity.y += 250;
    }
    else {
      this.player.body.velocity.y = 0;
    }
        
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= 250;
        if(this.animationRunning == false){
            this.player.animations.play('walkleft');
        }
        
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += 250;
        if(this.animationRunning == false){
            this.player.animations.play('walkright');
        }
    }
    else{
        this.player.animations.play('left');
    }
        
    if(this.game.input.activePointer.isDown){
        game.physics.arcade.moveToPointer(this.player, 250);
    }
        
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
        
    },
    stopTimer: function() {
        this.animationRunning = false;
    }

}