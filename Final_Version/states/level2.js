var Level2 = function () { };
var spellArray = ['', '', ''];
var keyQ;
var keyW;
var keyE;
var s1T;
var s2T;
var s3T;
var playerStatsArray = ['LV', 'CURHP', 'MAXHP',
                         'CURMP', 'MAXMP', 'CUREXP', 'MAXEXP'];
var elements = [];
var firebolts;
var firecircles;
Level2.prototype = {
    preload: function(){
        //game.load.tilemap('tutorial_map', '/../assets/tilesheet/tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('Level2', '/../assets/tilesheet/level3.json', null, Phaser.Tilemap.TILED_JSON);
        //game.load.image('tilesheet', '/../assets/tilesheet/tilesheet.png');
        game.load.image('tilesheetLarge', '/../assets/tilesheet/tilesheetLarge.png');
        //game.load.image('player', '/../assets/images/player.png');
        game.load.spritesheet('playerSpriteSheet', '/../assets/images/player.png', 128, 128);
        game.load.image('enemyRat', '/../assets/enemies/enemyRat.png', 128, 128);
        game.load.image('overlay', '/../assets/images/overlay2.png');
        game.load.image('elementFire', '/../assets/images/elementFire.png');
        game.load.image('elementWater', '/../assets/images/elementWater.png');
        game.load.image('firebolt', '/../assets/images/firebolt.png');
        game.load.image('vases', '/../assets/images/vases.png', 128, 128);
        game.load.image('spellbook', '/../assets/images/spellbook.png', 128, 128);
        game.load.spritesheet('firecircle', '/../assets/images/FireExplosion.png', 266, 267);
        game.load.image('healthBar', '/../assets/images/healthbar.png');
        game.load.image('manaBar', '/../assets/images/manabar.png');
        game.load.image('expBar', '/../assets/images/expbar.png');
        game.load.image('key1', '/../assets/images/key.png');
        game.load.spritesheet('boss2', '/../assets/enemies/MAGA_spritesheet.png', 64, 96);
        game.load.spritesheet('explosion', '/../assets/images/explosionSpriteSheet.png',128,120);
        game.load.audio('background4', ['/../assets/bgm/background2.mp3']);
        game.load.audio('explosionSound', ['/../assets/bgm/fire1.wav']);
        game.load.audio('walk', ['/../assets/bgm/walk.mp3']);
        game.load.image('ladder', '/../assets/images/ladder.png');
        game.load.image('heart', '/../assets/images/heart.png', 48, 128);
        game.load.image('deathText', '/../assets/images/deathText.png', 48, 128);


        this.animationRunning = false;
        this.timer = game.time.create(false);
        
    },
    createEnemyRatMob: function(x,y){
        this.enemyRat.create(x,y,'enemyRat');
    },
    create: function () {

        this.controlState = { state: "", mode: "" };
        this.controlState.state = "player";

        this.mainSound = game.add.audio('background4');
        this.fireBlastSound = game.add.audio('explosionSound');
        this.walk = game.add.audio('walk');
        this.walk.volume = 1;
        this.walk.repeat = true;
        this.mainSound.play();
        this.walkLoop = new Phaser.Sound(game,'walk',100,true);
        this.walkLoop.play();
        this.walking = false;
        this.walkTimer = game.time.create(false);
        this.walkTimer.repeat(400, 100000, this.allowWalkSound, this); 
        this.walkTimer.start();
        this.spellLearned = false; // used for picking up the spell book
        this.elementFire = this.game.add.sprite(10,711,'elementFire');
        this.elements = this.game.add.group();    
        
        this.map = this.game.add.tilemap('Level2');
        this.map.addTilesetImage('tilesheetLarge', 'tilesheetLarge');

        //create layer
        this.backgroundlayer = this.map.createLayer('background');
        this.blockedLayer = this.map.createLayer('blocked');
        this.bossDoor = this.map.createLayer('bossDoor');
        
        this.map.setCollisionBetween(1, 2000, true, 'blocked');
        this.map.setCollisionBetween(1, 2000, true, 'bossDoor');
        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();

        this.player = this.game.add.sprite(400, 350, 'playerSpriteSheet');
        this.game.physics.arcade.enable(this.player);

        interfaceManager.setPlayer(this.player);    
        interfaceManager.setGame(this.game);
        interfaceManager.setUpHelpMenu();
        soundManager.setPlayer(this.player);    
        soundManager.setGame(this.game);
        soundManager.initializeSound();
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
        this.player.animations.add('death', [21,22,23,24,25,26,27], 10, true);       

        
        attack_left   = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        attack_right  = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
        this.enemyRat = this.game.add.group();
        this.enemyRat.enableBody = true;
        
        
        //generating key
        this.doorKey = this.add.sprite(508.46233204384737, 1200, 'key1');
        this.game.physics.arcade.enable(this.doorKey);

        interfaceManager.displayOverlay();  
        interfaceManager.setHealth(5);
        interfaceManager.setEnergy();

        //boss2
        this.initializeBoss2();
        this.boss2Defeated = false;

        this.exitLadder = this.game.add.sprite(this.boss2.body.x + 200, this.boss2.body.y, 'ladder');
        this.exitLadder.visible = false;

        this.textTimer = game.time.create(false);

         this. keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
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
            }
            else if (spellArray[1] === '') {
                spellArray[1] = 'E';
            }
            else if (spellArray[2] === '') {
                spellArray[2] = 'E';
            }
        }, this);
       
        firebolts = game.add.group();
        firebolts.enableBody = true;
        firebolts.physicsBodyType = Phaser.Physics.ARCADE;
        firebolts.createMultiple(20, 'firebolt');

        firecircles = game.add.group();
        firecircles.enableBody = true;
        firecircles.physicsBodyType = Phaser.Physics.ARCADE;
        firecircles.createMultiple(6, 'firecircle');

        this.createEnemyRatMob(260,830);
        this.createEnemyRatMob(774,628);
        this.createEnemyRatMob(1358,225);
        this.createEnemyRatMob(2060,232);
        this.createEnemyRatMob(1831, 757);
        this.createEnemyRatMob(2814, 740);
        this.createEnemyRatMob(2644, 233);
        this.createEnemyRatMob(3131, 1314);
        this.createEnemyRatMob(3512, 2700);
        this.createEnemyRatMob(3354, 3300);
        this.createEnemyRatMob(542, 2827);
        this.createEnemyRatMob(451, 2223);
        this.createEnemyRatMob(249, 1404);
        this.createEnemyRatMob(567, 1404);
        this.createEnemyRatMob(803, 1404);  
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
            this.game.state.start('LevelSelect2');
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
            this.game.state.start('Level2');
      }, this);
        }
    },
    showDeathText: function(){
           this.game.add.sprite(this.player.x- 400 ,this.player.y - 100,'deathText');
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
        this.spellbookVase.setVisible(false);
    },
    pickupspellbook: function (){
        this.spellbook.kill();
        
    },
    pickupKey1: function (doorKey) {
        doorKey.kill();
        return true;
    },
    goback: function (tmp){
        return true;
    },
    update: function () {
        this.checkPlayerMovement();
        this.checkSpellArray();
        this.checkEnemyAggro();
        this.checkboss2State();
        
        this.game.physics.arcade.overlap(this.player, this.enemyRat, this.touchRat, null, this);     
        this.game.physics.arcade.collide(this.enemyRat);
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.player, this.vases);
        this.game.physics.arcade.collide(this.enemyRat, this.blockedLayer);
        this.game.physics.arcade.collide(this.player, this.bossDoor);
        this.game.physics.arcade.collide(firebolts, this.blockedLayer, this.killFire, null, this);
        this.game.physics.arcade.overlap(firecircles, this.enemyRat, this.killRat2, null, this);
        this.game.physics.arcade.overlap(this.boss2, firebolts, this.damageBoss, null, this);
        this.game.physics.arcade.overlap(this.enemyRat, firebolts, this.killRat, null, this);
        this.game.physics.arcade.overlap(this.vases, firebolts, this.killVase, null, this);
        this.game.physics.arcade.overlap(this.spellbookVase, this.player, this.killspellbookvase, null, this);
        if (this.game.physics.arcade.overlap(this.doorKey, this.player, this.pickupKey1)) {
            this.bossDoor.destroy();
        }
        console.log(this.boss2Defeated);
        if (this.boss2Defeated == true) {
            if (this.game.physics.arcade.overlap(this.level3Key, this.player)) {
                //input level here
            }
            if (this.game.physics.arcade.overlap(this.exit2, this.player, this.door, this.goback)) {
                this.state.start('LevelSelect');
            }
        }

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
    if (this.bossDefeated == true) {
        this.text.x = Math.floor(this.villainBoss.x - 130);
        this.text.y = Math.floor(this.villainBoss.y - 30);
    }
    if ((Math.abs(this.player.x - this.key2.x) < 50) && (Math.abs(this.player.y - this.key2.y) < 50)) {
        this.pickupkey2();
    }
    if ((Math.abs(this.player.x - this.exitLadder.x) < 50) && (Math.abs(this.player.y - this.exitLadder.y) < 50)) {
        this.returnToLevelSelect();
    }
    },
    returnToLevelSelect: function (player, key) {
        console.log("returning to level select");
        this.key1.onDown.removeAll();
        this.key2.onDown.removeAll();
        this.key3.onDown.removeAll();
        this.key4.onDown.removeAll();
        this.keyQ.onDown.removeAll();
        this.keyW.onDown.removeAll();
        this.keyE.onDown.removeAll();
        //this.keyR.onDown.removeAll();
        this.game.state.start('LevelSelect');
    },
    pickupkey2 : function(player, key){   
        this.key2.visible = false;
        console.log("key picked up");
    },
    stopTimer: function() {
        this.animationRunning = false;
    },
    addBoss2Animations: function () {
        this.boss2.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        this.boss2.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
        this.boss2.animations.add('left', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
        this.boss2.animations.add('jump_right', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 10, true);
        this.boss2.animations.add('jump_left', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, true);
        this.boss2.animations.add('attack_left', [50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 10, true);
        this.boss2.animations.add('attack_right', [60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 10, true);
        this.boss2.animations.add('death', [70, 71, 72, 73, 74, 75, 76, 77, 78, 79], 10, true);
        this.boss2.animations.add('damage_left', [80, 81, 82, 83, 84, 85, 86, 87, 88, 89], 10, true);
        this.boss2.animations.add('damage_right', [90, 91, 92, 93, 94, 95, 96, 97, 98, 99], 10, true);
    },
    initializeBoss2: function () {
        this.boss2 = game.add.sprite(2004.2392064206358, 2156.9791085883985, 'boss2');
        this.boss2.scale.setTo(2, 2);
        this.boss2State = { state: "", mode: "", health:100};
        this.boss2State.state = "moving";
        this.boss2State.mode = "easy";
        this.game.physics.arcade.enable(this.boss2);
        this.addBoss2Animations();
    },
    damageBoss: function (boss2, firebolt) {
        this.fireBlastSound.play();
        this.currentExplosion = this.game.add.sprite(this.boss2.x + 50, this.boss2.y + 50, 'explosion');
        this.currentExplosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10, true);
        this.currentExplosion.animations.play('explode', 10, false, false);
        this.boss2State.health = this.boss2State.health - 20;
        firebolt.kill();
    },
    checkboss2State: function () {
        if (this.boss2State.health <= 0 && this.boss2Defeated == false) {
            this.boss2Defeated = true;
            this.boss2.animations.play("death", 10, false, true);
            this.boss2DefeatedText = "This was a bigly mistake. Feelsbadman";
            this.scrollText(this.boss2DefeatedText);
            this.boss2.body.velocity.x = 0;
            this.boss2.body.velocity.y = 0;
            this.key2.visible = true;
            this.exitLadder.visible = true;
        }
        else if (this.boss2State.health > 0) {
            if ((Math.abs(this.player.x - this.boss2.x)) < 375 && (Math.abs(this.player.y - this.boss2.y)) < 375 || this.boss2State.health < 100) {
                this.boss2State.state = "follow";
            }
            if (this.boss2State.state == "follow") {
                if ((Math.abs(this.player.x + 30 - this.boss2.x)) > 75 || (Math.abs(this.player.y + 30 - this.boss2.y) > 130)) {
                    this.boss2.animations.play("right", 10, true, true);
                    ratDistancex = this.player.x - this.boss2.x;
                    ratDistancey = this.player.y - this.boss2.y;
                    totalDistanceAway = Math.sqrt(ratDistancex * ratDistancex + ratDistancey * ratDistancey);
                    angleY = Math.sin(ratDistancey / totalDistanceAway);
                    angleX = Math.cos(ratDistancex / totalDistanceAway);
                    velocityX = angleX * 150;
                    velocityY = angleY * 150;
                    if ((this.player.x - this.boss2.x) < 0) {
                        velocityX = -velocityX;
                    }

                    this.boss2.body.velocity.x = velocityX;
                    this.boss2.body.velocity.y = velocityY;
                }
                else if ((Math.abs(this.player.x + 30 - this.boss2.x)) <= 110 || (Math.abs(this.player.y + 30 - this.boss2.y) <= 135)) {
                    this.boss2.animations.play("damage_left");
                    this.boss2.body.velocity.x = 0;
                    this.boss2.body.velocity.y = 0;
                }
                else {
                    this.boss2.body.velocity.x = 0;
                    this.boss2.body.velocity.y = 0;
                }
            }
        }
        this.timer.start();

    },
    scrollText: function (gameText) {
        this.script = "o";
        this.script = gameText;
        this.scriptCounter = 0;
        this.style = { font: "32px Arial", fill: "#FFFFFF", wordWrap: false, align: "center", backgroundColor: "#ffff00" };
        this.dialogue = "";
        //this.text.destroy();
        this.textLength = 20;
        this.text = game.add.text(350, 350, this.dialogue, this.style);
        this.textTimer.repeat(100, this.script.length, this.updateText, this);
        this.textTimer.start();
    },
    updateText: function () {
        if (this.script[this.scriptCounter + 1] == " " && this.script[this.scriptCounter] == " ") {
            this.dialogue = "";
            this.text.destroy();
            this.text = game.add.text(350, 350, this.dialogue, this.style);
            this.textTimer.stop();
            this.return;
            this.scriptCounter = 0;
        }
        else {
            this.text.destroy();
            this.dialogue = this.dialogue + this.script[this.scriptCounter];
            if (this.scriptCounter > this.textLength && this.script[this.scriptCounter] == " ") {
                this.dialogue = "";
                this.textLength = this.textLength + 28;
            }
            this.scriptCounter++;
            this.text = game.add.text(350, 350, this.dialogue, this.style);
        }
    },
    setHealth: function (lives) {
        this.hearts.enableBody = true;
        for (var i = 0; i < lives; i++) {
            var heart = this.hearts.create(470 + 40 * i, 700, 'heart');
            heart.fixedToCamera = true;
        }
    },
    checkPlayerMovement: function () {
        if (this.controlState.state == "player") {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;

            if (this.game.input.activePointer.isDown) {
                game.physics.arcade.moveToPointer(this.player, 250);
                if (this.animationRunning == false) {
                    if (this.player.body.velocity.x < 0) {
                        this.player.animations.play('walkleft');
                    }
                    else {
                        this.player.animations.play('walkright');
                    }
                }
            }
        }
        else if (this.controlState.state == "bengy") {
            this.boss.body.velocity.x = 0;
            this.boss.body.velocity.y = 0;
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;

            if (this.cursors.up.isDown) {
                if (this.boss.body.velocity.y == 0)
                    this.boss.body.velocity.y -= 250;
            }
            else if (this.cursors.down.isDown) {
                if (this.boss.body.velocity.y == 0)
                    this.boss.body.velocity.y += 250;
            }
            else {
                this.boss.body.velocity.y = 0;
            }

            if (this.cursors.left.isDown) {
                this.boss.body.velocity.x -= 250;
                if (this.animationRunning == false) {

                }
            }
            else if (this.cursors.right.isDown) {
                this.boss.body.velocity.x += 250;
                if (this.animationRunning == false) {

                }
            }
            else {

            }
            if (this.game.input.activePointer.isDown) {
                game.physics.arcade.moveToPointer(this.boss, 250);

            }
        }
    },
}