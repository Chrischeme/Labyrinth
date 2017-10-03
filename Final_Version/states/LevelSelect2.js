var LevelSelect2 = function () { };

LevelSelect2.prototype = {
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

    preload: function () {
        game.load.tilemap('levelSelection', '/../assets/tilesheet/levelselection.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tilesheetLarge', '/../assets/tilesheet/tilesheetLarge.png');
        game.load.spritesheet('playerSpriteSheet', '/../assets/images/player.png', 128, 128);
        game.load.image('overlay', '/../assets/images/overlay2.png');
        game.load.image('elementFire', '/../assets/images/elementFire.png');
        game.load.image('elementWater', '/../assets/images/elementWater.png');
        game.load.image('firebolt', '/../assets/images/firebolt.png');
        game.load.spritesheet('firecircle', '/../assets/images/FireExplosion.png', 266, 267);
        game.load.image('healthBar', '/../assets/images/healthbar.png');
        game.load.image('manaBar', '/../assets/images/manabar.png');
        game.load.image('expBar', '/../assets/images/expbar.png');
        game.load.image('key1', '/../assets/images/key.png');
        game.load.image('openDoor', '/../assets/images/openDoor.png');
        game.load.image('lockedDoor', '/../assets/images/lockedDoor.png');
        game.load.image('lockedDoor2', '/../assets/images/lockedDoor2.png');
        game.load.image('lockedDoor3', '/../assets/images/lockedDoor2.png');
        game.load.image('ladder', '/../assets/images/ladder.png');
        game.load.image('vases', '/../assets/images/vases.png', 128, 128);
        this.animationRunning = false;
        this.timer = game.time.create(false);

    },
    create: function () {
        interfaceManager.setPlayer(this.player);    
        interfaceManager.setGame(this.game);
        interfaceManager.setUpHelpMenu();
        soundManager.setPlayer(this.player);    
        soundManager.setGame(this.game);
        soundManager.initializeSound();

        this.spellLearned = false; // used for picking up the spell book
        this.elementFire = this.game.add.sprite(10, 711, 'elementFire');
        this.elements = this.game.add.group();
        //loads level selection map
        this.map = this.game.add.tilemap('levelSelection');
        this.map.addTilesetImage('tilesheetLarge', 'tilesheetLarge');
        //creates layers
        this.backgroundlayer = this.map.createLayer('background');
        this.blockedLayer = this.map.createLayer('blocked');
        this.level1 = this.game.add.sprite(1152.5, 0,'openDoor');
        this.level4 = this.game.add.sprite(0, 1024, 'openDoor');
        this.level2 = this.game.add.sprite(2305, 1024, 'lockedDoor3');

        //adds a ladder
        this.ladder = this.game.add.sprite(256, 256, 'ladder');
        this.game.physics.arcade.enable(this.ladder);
        this.game.physics.arcade.enable(this.level1);
        this.game.physics.arcade.enable(this.level2);
        this.game.physics.arcade.enable(this.level4);

        interfaceManager.displayOverlay();  
        interfaceManager.setHealth(5);
        interfaceManager.setEnergy();

        //creates colliable areas
        this.map.setCollisionBetween(1, 2000, true, 'blocked');
        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();

        this.player = this.game.add.sprite(400, 350, 'playerSpriteSheet');
        this.game.physics.arcade.enable(this.player);

        // Creates vases to direct person towards level 1
        this.vases = this.game.add.group();
        this.vases.immovable = true;
        this.vases.enableBody = true;    
        
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);

        this.player.animations.add('attack_left', [7, 8, 9, 10, 11, 12, 13, 13, 13], 10, true);
        this.player.animations.add('attack_right', [14, 15, 16, 17, 18, 19, 20, 20, 20], 10, true);
        this.player.animations.add('idleleft', [2, 3], 1, true);
        this.player.animations.add('idleright', [0, 1], 1, true);
        this.player.animations.add('walkleft', [0, 1], 6, true);
        this.player.animations.add('walkright', [2, 3], 6, true);

        attack_left = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        attack_right = game.input.keyboard.addKey(Phaser.Keyboard.X);   
        
        this.key1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.key1.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.game.state.start('Game');
        }, this);
        this.key2 = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.key2.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.game.state.start('Level2');
        }, this);
        this.key3 = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.key3.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.game.state.start('Game4');
        }, this);
        this.key4 = game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.key4.onDown.add(function() {
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.game.state.start('LevelSelect');
        }, this);
    },
    doorOpen: function (){
        return true;
    },
    update: function () {
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        
        //loads different levels
        if(this.game.physics.arcade.overlap(this.player, this.level1, this.doorOpen)){
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.game.state.start('Game');
            console.log("Level1");
        }
        if(this.game.physics.arcade.overlap(this.player, this.level4, this.doorOpen)){
            this.key1.onDown.removeAll();
            this.key2.onDown.removeAll();
            this.key3.onDown.removeAll();
            this.key4.onDown.removeAll();
            this.game.state.start('Level2');
            console.log("level4");
        }
        if (this.game.physics.arcade.overlap(this.player, this.ladder, this.doorOpen)) {
            this.state.start('GameMenu');
        }
        if (this.animationRunning == false) {
            if (this.player.body.velocity.x < 0) {
                this.player.animations.play('walkleft');
            }
            else {
                this.player.animations.play('walkright');
            }
        }
        // sprite movement animations    

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (this.game.input.activePointer.isDown) {
            game.physics.arcade.moveToPointer(this.player, 250);
        }
        if (attack_left.isDown) {
            this.player.animations.play('attack_left', 10, false, false);
            this.animationRunning = true;
            this.timer.repeat(500, 0, this.stopTimer, this);
            this.timer.start();
        }
        if (attack_right.isDown) {
            this.player.animations.play('attack_right', 10, false, false);
            this.animationRunning = true;
            this.timer.repeat(500, 0, this.stopTimer, this);
            this.timer.start();
        }
    },
}