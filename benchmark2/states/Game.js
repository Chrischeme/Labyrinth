var Game = function () { };
var spellArray = ['', '', ''];
var keyQ;
var keyW;
var keyE;
var s1T;
var s2T;
var s3T;
var playerStatsArray = ['LV', 'CURHP', 'MAXHP',
                         'CURMP', 'MAXMP', 'CUREXP', 'MAXEXP'];
var firebolts;
var firecircles;
Game.prototype = {
    
    preload: function(){
        game.load.tilemap('tutorial_map', '/../benchmark2/assets/tilesheet/tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tilesheet', '/../benchmark2/assets/tilesheet/tilesheet.png');
        //game.load.image('player', '/../assets/images/player.png');
        game.load.spritesheet('playerSpriteSheet', '/../benchmark2/assets/images/player.png', 128, 128);
        game.load.image('enemyRat', '/../benchmark2/assets/enemies/enemyRat.png', 128, 128);
        game.load.image('overlay', '/../benchmark2/assets/images/overlay2.png');
        game.load.image('firebolt', '/../benchmark2/assets/images/firebolt.png');
        game.load.spritesheet('firecircle', '/../benchmark2/assets/images/FireExplosion.png',266,267);
        this.animationRunning = false;
        this.timer = game.time.create(false);
        
    },
    createEnemyRatMob: function(x,y){
        this.enemyRat.create((x-200),(y+150),'enemyRat');
        console.log("loadEnemies function ran");
        this.enemyRat.create((x+200),(y+150),'enemyRat');
        console.log("loadEnemies function ran");
        this.enemyRat.create(x,y,'enemyRat');
        console.log("loadEnemies function ran");        
    },
    create: function() {
    this.map = this.game.add.tilemap('tutorial_map');
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tutorial_map', 'tilesheet');

    //create layer
    this.backgroundlayer = this.map.createLayer('walkable');
        this.visible = this.map.createLayer('visible');
    this.blockedLayer = this.map.createLayer('blockedLayer');

    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer')    
        
    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    this.player = this.game.add.sprite(400, 350, 'playerSpriteSheet');
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
        
    this.createEnemyRatMob(1000,400);
    this.createEnemyRatMob(2310,390);
    this.createEnemyRatMob(1400,875);
    this.createEnemyRatMob(2500,1630);
    this.createEnemyRatMob(795,1830);
    var overlay = this.game.add.sprite(0,0,'overlay');
    overlay.fixedToCamera = true;
      keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
      keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
      keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
      keyQ.onDown.add(function() {
          if (spellArray[0] === '') {
              spellArray[0] = 'Q';
          }
          else if (spellArray[1] === '') {
              spellArray[1] = 'Q';
          }
          else if (spellArray[2] === '') {
              spellArray[2] = 'Q';
          }
      }, this);
      keyW.onDown.add(function() {
        if (spellArray[0] === '') {
              spellArray[0] = 'W';
          }
          else if (spellArray[1] === '') {
              spellArray[1] = 'W';
          }
          else if (spellArray[2] === '') {
              spellArray[2] = 'W';
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
},
    touchRat: function(){
        console.log("rat touched");
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
                    }
                  else if(spellArray[2] === 'W'){
                      this.firecircle();
                  }
                  
              }
          }
          // output what the key combo was, then reset it to empty strings
          spellArray = ['', '', ''];
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
        rat.kill();
        firebolt.kill();
    },
    killRat2: function (firecricle, rat) {
        rat.kill();
    },
    killFire: function (firebolt) {
        firebolt.kill();
    },
    update: function() {
    this.checkSpellArray();
    this.checkEnemyAggro();    
    this.game.physics.arcade.overlap(this.player, this.enemyRat, this.touchRat, null, this);     
    this.game.physics.arcade.collide(this.enemyRat);
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.enemyRat, this.blockedLayer);
    this.game.physics.arcade.collide(firebolts, this.blockedLayer, this.killFire, null, this);
    
    this.game.physics.arcade.overlap(firecircles, this.enemyRat, this.killRat2, null, this);
    
    this.game.physics.arcade.overlap(this.enemyRat, firebolts, this.killRat, null, this);
    if(this.animationRunning == false){
        if(this.player.body.velocity.x < 0){
            this.player.animations.play('walkleft');
        }
        else{
            this.player.animations.play('walkright');
        }
    }
        
    // sprite movement animations    
        
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
        if(true){
        var mouseLocationx = this.game.input.mousePointer.x;
        var mouseLocationWorldx = this.game.input.mousePointer.worldX;
        var spriteLocationx = this.player.x + 30; 
        var cameraLocationx = this.game.camera.x;
            
        var mouseLocationy = this.game.input.mousePointer.y;
        var mouseLocationWorldy = this.game.input.mousePointer.worldY;
        var spriteLocationy = this.player.y + 90; 
        var cameraLocationy = this.game.camera.y;
            
        currentTargetLocationX = mouseLocationWorldx;
        currentTargetLocationY = mouseLocationWorldy;
            
        var mouseDistanceX = mouseLocationWorldx - spriteLocationx;
        var mouseDistanceY = mouseLocationWorldy - spriteLocationy; 
            
        //calculate total squared distance away
        var totalDistanceAway = Math.sqrt(mouseDistanceX*mouseDistanceX + mouseDistanceY*mouseDistanceY);
            
        angleX = Math.sin(mouseDistanceY/totalDistanceAway);
        angleY = Math.cos(mouseDistanceX/totalDistanceAway);
            
        velocityY = angleX * 250;
        velocityX = angleY * 250;
        console.log("anglex: " + angleX);
        console.log("angley: " +angleY);
        console.log("velx: " + velocityX);
        console.log("vely: " + velocityY);
        
        if(mouseLocationWorldx - spriteLocationx < 0){
            velocityX = -velocityX;   
        }
            
        this.player.body.velocity.x = velocityX;
        this.player.body.velocity.y = velocityY;   
            
        }
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