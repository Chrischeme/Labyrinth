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
var enemyFirebolts;
var enemyFirecircles;
Game4.prototype = {
    
    preload: function(){
        
        playerStateManager.getHealth();
        
        //game.load.tilemap('tutorial_map', '/../assets/tilesheet/tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('Level4', '/../assets/tilesheet/Level4.json', null, Phaser.Tilemap.TILED_JSON);
        //game.load.image('tilesheet', '/../assets/tilesheet/tilesheet.png');
        game.load.image('tilesheet', '/../assets/tilesheet/tilesheet.png');
        //game.load.image('player', '/../assets/images/player.png');
        game.load.image('winningAnim', '/../assets/images/blankBG.png');
        game.load.image('winText', '/../assets/images/winMessage.png');
        game.load.spritesheet('playerSpriteSheet', '/../assets/images/player.png', 128, 128);
        game.load.spritesheet('bossSpriteSheet', '/../assets/images/evilPlayer.png', 128, 128);
        game.load.image('enemyRat', '/../assets/enemies/enemyRat.png', 128, 128);
        game.load.image('overlay', '/../assets/images/overlay2.png');
        game.load.image('elementFire', '/../assets/images/elementFire.png');
        game.load.image('elementWater', '/../assets/images/elementWater.png');
        game.load.image('cosmic', '/../assets/images/cosmic.png');
        game.load.image('firebolt', '/../assets/images/firebolt.png');
        game.load.image('eFirebolt', '/../assets/images/eFirebolt.png');
        game.load.image('vases', '/../assets/images/vases.png', 128, 128);
        game.load.image('spellbook', '/../assets/images/spellbook.png', 128, 128);
        game.load.spritesheet('firecircle', '/../assets/images/FireExplosion.png',266,267);
        game.load.spritesheet('efirecircle', '/../assets/images/eFireExplosion.png',266,267);
        game.load.image('heart', '/../assets/images/heart.png', 48, 128);
        game.load.image('deathText', '/../assets/images/deathText.png', 48, 128);
        
        this.animationRunning = false;
        this.timer = game.time.create(false);

        game.load.spritesheet('explosion', '/../assets/images/explosionSpriteSheet.png',128,120);
        game.load.audio('background4', ['/../assets/bgm/background4.mp3']);
        game.load.audio('explosionSound', ['/../assets/bgm/fire1.wav']);
        game.load.audio('walk', ['/../assets/bgm/walk.mp3']);
        game.load.audio('ow', ['/../assets/bgm/ow.mp3']);
        
    },
    create: function() {

        this.controlState = {state:"", mode:""};
        this.controlState.state = "player";
        this.mainSound = game.add.audio('background4');
        this.fireBlastSound = game.add.audio('explosionSound');
        this.walk = game.add.audio('walk');
        this.damageSound = game.add.audio('ow');
        this.walk.volume = 1;
        this.walk.repeat = true;
        this.mainSound.play();
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
        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();

        this.winAnim = this.game.add.sprite(0, 0, 'winningAnim');
        this.winAnim.fixedToCamera = true;
        this.winAnim.alpha = 0;

        this.winText = this.game.add.sprite(400, 300, 'winText');
        this.winText.fixedToCamera = true;
        this.winText.alpha = 0;
        this.wonGame = false;
        
        this.player = this.game.add.sprite(200, 200, 'playerSpriteSheet');
        this.game.physics.arcade.enable(this.player);

        interfaceManager.setPlayer(this.player);    
        interfaceManager.setGame(this.game);
        interfaceManager.setUpHelpMenu();
        soundManager.setPlayer(this.player);    
        soundManager.setGame(this.game);
        soundManager.initializeSound();
        
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);
        
        this.player.animations.add('attack_left', [7,8,9,10,11,12,13,13,13], 10, true);
        this.player.animations.add('attack_right', [14,15,16,17,18,19,20,20,20], 10, true);
        this.player.animations.add('idleleft', [2,3], 1,true);
        this.player.animations.add('idleright', [0,1], 1,true);    
        this.player.animations.add('walkleft', [0,1], 6,true);
        this.player.animations.add('walkright', [2,3], 6,true);  
        this.player.animations.add('death', [21,22,23,24,25,26,27], 10, true);       
    

        this.boss = this.game.add.sprite(2304,2304,'bossSpriteSheet');
        this.game.physics.arcade.enable(this.boss);
        this.boss.animations.add('attack_left', [7,8,9,10,11,12,13,13,13], 10, true);
        this.boss.animations.add('idleleft', [2,3], 1,true);
        this.boss.animations.add('death', [21,22,23,24,25,26,27], 10, true);
        this.boss.animations.play('idleleft');
        this.boss.currentHealth = 5;
        this.boss.dead = false;

        attack_left   = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        attack_right  = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
        this.enemyRat = this.game.add.group();
        this.enemyRat.enableBody = true;

        //this.maxHealth.fixedtoCamera = true;
        this.bossText = "It seems I can't leave until the boss is down  ";
        this.bossTextPlayed = false;

        interfaceManager.displayOverlay();  
        interfaceManager.setHealth(5);
        interfaceManager.setEnergy();

        this.MonsterTimer = game.time.create(false);    
        this.monsterEnable = true;

        this.bossTimer = game.time.create(false);
        this.boss.castedSpell = false;
        
        this.enemyMovementTimer = game.time.create(false);

        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
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

        enemyFirebolts = game.add.group();
        enemyFirebolts.enableBody = true;
        enemyFirebolts.physicsBodyType = Phaser.Physics.ARCADE;
        enemyFirebolts.createMultiple(20, 'eFirebolt');

        enemyFirecircles = game.add.group();
        enemyFirecircles.enableBody = true;
        enemyFirecircles.physicsBodyType = Phaser.Physics.ARCADE;
        enemyFirecircles.createMultiple(20, 'efirecircle');
        this.touchedFC = false;

        firecircles = game.add.group();
        firecircles.enableBody = true;
        firecircles.physicsBodyType = Phaser.Physics.ARCADE;
        firecircles.createMultiple(6, 'firecircle');

        this.enemyRat.create(640,640,'enemyRat');
        this.enemyRat.create(256,1024,'enemyRat');
        this.enemyRat.create(1152,768,'enemyRat');
        this.enemyRat.create(1408,128,'enemyRat');
        this.enemyRat.create(1664,1280,'enemyRat');
        this.enemyRat.create(1304,1024,'enemyRat');
        this.enemyRat.create(2816,1024,'enemyRat');
        this.enemyRat.create(2432,256,'enemyRat');
        this.enemyRat.create(384,1920,'enemyRat');
        this.enemyRat.create(1280,1920,'enemyRat');

        this.textTimer = game.time.create(false);  
        this.walkTimer = game.time.create(false);
        this.walkTimer.repeat(400, 100000, this.allowWalkSound, this); 
        this.walkTimer.start();
        this.key1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.key1.onDown.add(function() {
                this.key1.onDown.removeAll();
                this.key2.onDown.removeAll();
                this.key3.onDown.removeAll();
                this.key4.onDown.removeAll();
                this.keyQ.onDown.removeAll();
                this.keyW.onDown.removeAll();
                this.keyE.onDown.removeAll();
                this.mainSound.stop();
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
                this.mainSound.stop();
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
                this.mainSound.stop();
                this.game.state.start('Game4');
        }, this);
        this.key4 = game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.key4.onDown.add(function() {
                this.key1.onDown.removeAll();
                this.key2.onDown.removeAll();
                this.key3.onDown.removeAll();
                this.key4.onDown.removeAll();
                this.keyQ.onDown.removeAll();
                this.keyW.onDown.removeAll();
                this.keyE.onDown.removeAll();
                this.mainSound.stop();
                this.game.state.start('LevelSelect');
        }, this);
        this.bossTimer.loop(8000, this.enableSpell, this);
        this.bossTimer.start();        
        this.enemyMovementTimer.loop(2000, this.enemyMovements, this);
        this.enemyMovementTimer.start();
},
setHealth: function(lives){
    this.hearts.enableBody = true;
    for (var i = 0; i < lives; i++)
    {
        var heart = this.hearts.create(470 + 40*i,700,'heart');
        heart.fixedToCamera = true;
    }
    },
allowWalkSound : function(){
        this.walking = false;   
    },
    touchRat: function(){
        if(this.controlState.state != "dead"){
            interfaceManager.playerTakeDamage();
            if(interfaceManager.getCurrentLives() <= 0){
                this.playerDied();   
            }
        }
    },
    playerDied: function(){
        if (this.controlState.state != "dead") {
        this.controlState.state = "dead";
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.showDeathText();
        this.player.animations.play('death',10, false,false);
        this.keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
        this.keyB.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            this.keyR.onDown.removeAll();
            this.keyB.onDown.removeAll();
            this.mainSound.stop();
            interfaceManager.setCurrentLives(5);
            this.controlState.state = "player";
            this.game.state.start('LevelSelect');
        }, this);
        this.keyR.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.keyQ.onDown.removeAll();
            this.keyW.onDown.removeAll();
            this.keyE.onDown.removeAll();
            this.keyR.onDown.removeAll();
            this.keyB.onDown.removeAll();
            this.mainSound.stop();
            interfaceManager.setCurrentLives(5);
            this.controlState.state = "player";
            this.game.state.start('Game4');
      }, this);
        }
    },
    showDeathText: function(){
           this.game.add.sprite(this.player.x- 400 ,this.player.y - 100,'deathText');
    },
    enableMonsters: function(){
           this.monsterEnable = true;
    },
    checkEnemyAggro: function(){
        for (var i = 0, len = this.enemyRat.children.length; i<len; i++) {
            if ((Math.abs((this.player.x - this.enemyRat.children[i].x)) < 400) &&
            (Math.abs((this.player.y - this.enemyRat.children[i].y)) < 400)){
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
    enemyMovements: function() {
        for (var i = 0; i < this.enemyRat.children.length; i++) {
            var randomNum = this.enemyRat.children[i].angle +  (Math.floor(Math.random() * 120) - 60);
            this.enemyRat.children[i].body.velocity.x = Math.cos(randomNum) * 80;
            this.enemyRat.children[i].body.velocity.y = Math.sin(randomNum) * 80;
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
    },
    firecircle: function() {
        if(interfaceManager.getEnergyCount() < 3){
            return;   
        }
        interfaceManager.reduceEnergy();
        interfaceManager.reduceEnergy();
        interfaceManager.reduceEnergy();
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
        if (bodyX > 1792 && bodyX < 1920 && bodyY > 1792 && bodyY < 1920 && this.boss.dead) {
            this.player.body.x = 1536;
            this.player.body.y = 2944;
        }
    },
    touchFB: function(player, fire) {
        if (!this.touchedFC) {
        fire.kill();
        interfaceManager.playerTakeDamage();
        this.touchedFC = true;
        if(this.controlState.state != "dead"){
            interfaceManager.playerTakeDamage();
        if(interfaceManager.getCurrentLives() <= 0){
                this.playerDied();   
            }
        }
        }
    },
    touchFC: function() {
        if (!this.touchedFC) {
            this.touchedFC = true;
            if(this.controlState.state != "dead"){
            interfaceManager.playerTakeDamage();
            interfaceManager.playerTakeDamage();
            if(interfaceManager.getCurrentLives() <= 0){
                this.playerDied();   
            }
            }
        }
    },
    update: function() {
    this.checkSpellArray();
    this.checkEnemyAggro();    
    this.checkTeleporters();

    this.game.physics.arcade.overlap(this.player, this.enemyRat, this.touchRat, null, this);     
    this.game.physics.arcade.overlap(this.player, enemyFirebolts, this.touchFB, null, this);
    this.game.physics.arcade.overlap(this.player, enemyFirecircles, this.touchFC, null, this);
    this.game.physics.arcade.collide(this.enemyRat);
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.player, this.vases);
    this.game.physics.arcade.collide(this.enemyRat, this.blockedLayer);
    this.game.physics.arcade.collide(firebolts, this.blockedLayer, this.killFire, null, this);
    this.game.physics.arcade.collide(enemyFirebolts, this.blockedLayer, this.killFire, null, this);
        
    
    this.game.physics.arcade.overlap(firecircles, this.enemyRat, this.killRat2, null, this);
    this.game.physics.arcade.overlap(firebolts, this.boss, this.hurtBoss, null, this);
    this.game.physics.arcade.overlap(this.enemyRat, firebolts, this.killRat, null, this);
    this.game.physics.arcade.overlap(this.vases, firebolts, this.killVase, null, this);
    this.game.physics.arcade.overlap(this.spellbookVase, this.player, this.killspellbookvase, null, this);
    if(this.animationRunning == false && this.controlState.state != "dead"){
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
    }
    if(this.player.body.velocity.x == 0){
        this.walking = false;  
    }
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
        
    if(this.game.input.activePointer.isDown && this.controlState.state != 'dead' && !this.wonGame){
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
    if((this.player.body.x > 1792) && (this.player.body.y > 1792)){
        if(this.bossTextPlayed == false){
            this.scrollText(this.bossText);
            this.bossTextPlayed = true;
        }
    }
    if((this.player.body.x > 1920) && (this.player.body.y > 1920)){
        this.bossAI();
    }
        
    },
    winGame: function() {
        if (this.winAnim.alpha < 1) {
            this.winAnim.alpha = this.winAnim.alpha + 0.05;
        }
        else {
            this.winText.alpha = 1;
        }
    },
    hurtBoss: function(boss, firebolt) {
        this.fireBlastSound.play();
        this.currentExplosion = this.game.add.sprite(this.boss.x,this.boss.y,'explosion');
        this.currentExplosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
        this.currentExplosion.animations.play('explode',10, false,false);
        firebolt.kill();
        this.boss.currentHealth = this.boss.currentHealth - 1;
        if (this.boss.currentHealth <= 0) {
            this.boss.dead = true;
            this.boss.animations.play('death', 10, false, true);
            this.boss.animations.currentAnim.onComplete.add(function() {
                this.winTimer = game.time.create(false);
                this.winTimer.loop(200, this.winGame, this);
                this.winTimer.start();
                this.keyR = game.input.keyboard.addKey(Phaser.Keyboard.B);
                this.key1.onDown.removeAll();
                this.key2.onDown.removeAll();
                this.key3.onDown.removeAll();
                this.key4.onDown.removeAll();
                this.keyQ.onDown.removeAll();
                this.keyW.onDown.removeAll();
                this.keyE.onDown.removeAll();
                this.keyR.onDown.removeAll();
                this.wonGame = true;
                this.keyR.onDown.add(function() {
                    this.mainSound.stop();
                    this.controlState.state = "player";
                    this.game.state.start('GameMenu');
            }, this);
            }, this);
        }
    },
    useFireCirc: function(i) {
        if (i < 3) {
            var eFireCircle = enemyFirecircles.getFirstExists(false);
            if (eFireCircle) {
                eFireCircle.exists = true;
                eFireCircle.reset(2304 - i * 128, 2304 - i * 128);
                eFireCircle.scale.setTo((i*0.5) + 1, (i*0.5) + 1);
                game.physics.enable(eFireCircle, Phaser.Physics.ARCADE);
                eFireCircle.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
                eFireCircle.visible = true;
                eFireCircle.animations.play('explode', 10, false, true);
                eFireCircle.animations.currentAnim.onComplete.add(function() {
                this.useFireCirc(i+1);}, this);
            }
        }
    },
    bossAI: function() {
        if (!this.boss.dead && !this.boss.castedSpell) {
            this.touchedFC = false;
            this.boss.castedSpell = true;
            var randomNum = Math.floor(Math.random() * 6);
            console.log(randomNum);
            if (randomNum >= 4) {
                this.useFireCirc(0);
            }
            else if (randomNum == 3) {
                for (var i = 0; i < 20; i++) {
                    var eFirebolt = enemyFirebolts.getFirstExists(false);
                    if (eFirebolt) {
                        eFirebolt.exists = true;
                        eFirebolt.reset(1792 + 128, 1792 + (i * 64));
                        eFirebolt.lifespan = 2000;
                        game.physics.enable(eFirebolt, Phaser.Physics.ARCADE);
                        eFirebolt.angle = 0;
                        eFirebolt.body.velocity.x = 100;
                    }
                }
            }
            else if (randomNum == 2) {
                for (var i = 0; i < 20; i++) {
                    var eFirebolt = enemyFirebolts.getFirstExists(false);
                    if (eFirebolt) {
                        eFirebolt.exists = true;
                        eFirebolt.reset(2816, 1792 + (i * 64));
                        eFirebolt.lifespan = 2000;
                        game.physics.enable(eFirebolt, Phaser.Physics.ARCADE);
                        eFirebolt.angle = 180;
                        eFirebolt.body.velocity.x = -100;
                    }
                }
            }
            else if (randomNum == 1) {
                for (var i = 0; i < 20; i++) {
                    var eFirebolt = enemyFirebolts.getFirstExists(false);
                    if (eFirebolt) {
                        eFirebolt.exists = true;
                        eFirebolt.reset(1792 + (i * 64), 1792 + 128);
                        eFirebolt.lifespan = 2000;
                        game.physics.enable(eFirebolt, Phaser.Physics.ARCADE);
                        eFirebolt.angle = 90;
                        eFirebolt.body.velocity.y = 100;
                    }
                }
            }
            else {
                for (var i = 0; i < 20; i++) {
                    var eFirebolt = enemyFirebolts.getFirstExists(false);
                    if (eFirebolt) {
                        eFirebolt.exists = true;
                        eFirebolt.reset(1792 + (i * 64), 2816);
                        eFirebolt.lifespan = 2000;
                        game.physics.enable(eFirebolt, Phaser.Physics.ARCADE);
                        eFirebolt.angle = 270;
                        eFirebolt.body.velocity.y = -100;
                    }
                }
            }
        }
    },
    enableSpell: function() {
        this.boss.castedSpell = false;
    },
    scrollText: function(gameText){
        this.script = "o";
        this.script = gameText;
        console.log(gameText);
        this.scriptCounter = 0;
        this.style = { font: "32px Arial", fill: "#FFFFFF", wordWrap: false, align: "center", backgroundColor: "#ffff00" };
        this.dialogue = "";
        this.textLength = 20;
        this.text = game.add.text(this.player.x - 130, this.player.y - 30, this.dialogue, this.style);
        this.textTimer.repeat(100, this.script.length, this.updateText, this);
        this.textTimer.start();
    },
    updateText: function(){
        if(this.script[this.scriptCounter + 1] == " " && this.script[this.scriptCounter] == " "){
        this.dialogue = "";
        this.text.destroy();
        this.text = game.add.text(this.player.x - 130, this.player.y - 30, this.dialogue, this.style);
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
        this.text = game.add.text(this.player.x - 130, this.player.y - 30, this.dialogue, this.style);
        }
    },
    stopTimer: function() {
        this.animationRunning = false;
    }
    

}