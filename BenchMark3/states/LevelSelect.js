var LevelSelect = function () { };

LevelSelect.prototype = {
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
        game.load.image('key1', '/../assets/images/key1.png');
        game.load.image('openDoor', '/../assets/images/openDoor.png');
        game.load.image('lockedDoor', '/../assets/images/lockedDoor.png');
        game.load.image('lockedDoor2', '/../assets/images/lockedDoor2.png');
        game.load.image('lockedDoor3', '/../assets/images/lockedDoor2.png');
        game.load.image('ladder', '/../assets/images/ladder.png');
        this.animationRunning = false;
        this.timer = game.time.create(false);

    },
    create: function () {
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
        this.level2 = this.game.add.sprite(1152.5, 2305, 'openDoor');
        this.level3 = this.game.add.sprite(0, 1024, 'lockedDoor2');
        this.level4 = this.game.add.sprite(2305, 1024, 'openDoor');
        
        this.door1 = this.map.createLayer('door1');
        this.door2 = this.map.createLayer('door2');
        this.door3 = this.map.createLayer('door3');
        this.door4 = this.map.createLayer('door4');

        //adds a ladder
        this.ladder = this.game.add.sprite(256, 256, 'ladder');
        this.game.physics.arcade.enable(this.ladder);

        this.game.physics.arcade.enable(this.level1);
        this.game.physics.arcade.enable(this.level2);
        this.game.physics.arcade.enable(this.level3);
        this.game.physics.arcade.enable(this.level4);

        //creates colliable areas
        this.map.setCollisionBetween(1, 2000, true, 'blocked');
        this.map.setCollisionBetween(1, 2000, true, 'door1');
        this.map.setCollisionBetween(1, 2000, true, 'door2');
        this.map.setCollisionBetween(1, 2000, true, 'door3');
        this.map.setCollisionBetween(1, 2000, true, 'door4');
        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();

        this.player = this.game.add.sprite(400, 350, 'playerSpriteSheet');
        this.game.physics.arcade.enable(this.player);

        //the camera will follow the player in the world
        this.game.camera.follow(this.player);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.player.animations.add('attack_left', [7, 8, 9, 10, 11, 12, 13, 13, 13], 10, true);
        this.player.animations.add('attack_right', [14, 15, 16, 17, 18, 19, 20, 20, 20], 10, true);
        this.player.animations.add('idleleft', [2, 3], 1, true);
        this.player.animations.add('idleright', [0, 1], 1, true);
        this.player.animations.add('walkleft', [0, 1], 6, true);
        this.player.animations.add('walkright', [2, 3], 6, true);

        attack_left = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        attack_right = game.input.keyboard.addKey(Phaser.Keyboard.X);

        var overlay = this.game.add.sprite(0, 0, 'overlay');
        overlay.fixedToCamera = true;

        this.healthBar = this.add.sprite(460, 706, 'healthBar');
        this.manaBar = this.add.sprite(790, 706, 'manaBar');
        this.expBar = this.add.sprite(500, 760, 'expBar');

        this.healthBar.scale.setTo(1, 2.2);
        this.manaBar.scale.setTo(1, 2.2);
        this.expBar.scale.setTo(2, 2.2);

        this.healthBar.fixedToCamera = true;
        this.manaBar.fixedToCamera = true;
        this.expBar.fixedToCamera = true;

       
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

        var key1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
        key1.onDown.add(function() {
            this.game.state.start('Game');
        }, this);
        var key2 = game.input.keyboard.addKey(Phaser.Keyboard.S);
        key2.onDown.add(function() {
            this.game.state.start('Level2');
        }, this);
        var key3 = game.input.keyboard.addKey(Phaser.Keyboard.D);
        key3.onDown.add(function() {
            this.game.state.start('Game4', true, true);
        }, this);
    },
    checkSpellArray: function () {
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
                    else if (spellArray[2] === 'W') {
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
    firecircle: function () {
        var firecircle = firecircles.getFirstExists(false);
        firecircle.reset(this.player.x - 50, this.player.y - 50);
        firecircle.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
        firecircle.visible = true;
        firecircle.animations.play('explode', 10, false, true);
    },

    firebolt: function () {
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
            if (this.game.input.mousePointer.worldX - this.player.x < 0) {
                this.player.animations.play('attack_left', 10, false, false);
                this.animationRunning = true;
                this.timer.repeat(500, 0, this.stopTimer, this);
                this.timer.start();
            }
            else {
                this.player.animations.play('attack_right', 10, false, false);
                this.animationRunning = true;
                this.timer.repeat(500, 0, this.stopTimer, this);
                this.timer.start();
            }
        }
    },
    doorOpen: function (){
        return true;
    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        

        //loads different levels
        if(this.game.physics.arcade.overlap(this.player, this.level1, this.doorOpen)){
            this.game.state.start('Game');
            console.log("Level1");
        }
        if(this.game.physics.arcade.overlap(this.player, this.level2, this.doorOpen)){
            this.game.state.start('Level2');
            console.log("level2");
        }
        if(this.game.physics.arcade.overlap(this.player, this.level4, this.doorOpen)){
            this.game.state.start('Game4');
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

        if (this.cursors.up.isDown) {
            if (this.player.body.velocity.y == 0)
                this.player.body.velocity.y -= 250;
        }
        else if (this.cursors.down.isDown) {
            if (this.player.body.velocity.y == 0)
                this.player.body.velocity.y += 250;
        }
        else {
            this.player.body.velocity.y = 0;
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 250;
            if (this.animationRunning == false) {
                this.player.animations.play('walkleft');
            }

        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 250;
            if (this.animationRunning == false) {
                this.player.animations.play('walkright');
            }
        }
        else {
            this.player.animations.play('left');
        }

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