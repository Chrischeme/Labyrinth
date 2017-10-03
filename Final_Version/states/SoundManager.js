var soundManager = {
    mainSound: null,
    damageSound: null,
    walk: null,
    fireBlastSound: null,
    switchSound: null,
    switchSoundAvailable: true,
    walkSoundAvailable: true,
    setPlayer: function(currentPlayer){
        this.player = currentPlayer;
    },
    setGame: function(currentGameObject){
        this.game = currentGameObject;
    },
    initializeSound: function(){
        
        this.mainSound = game.add.audio('background');
        this.damageSound = game.add.audio('ow');
        this.explodeSound = game.add.audio('explosionSound');
        this.switchSound = game.add.audio('switch');
        
        this.walk = game.add.audio('walk');
        this.walk.volume = 0.1;
        this.walk.repeat = true;
        this.walkLoop = new Phaser.Sound(game,'walk',100,true);
        this.walking = false; 
        
        this.switchTimer = game.time.create(false);
        this.switchTimer.repeat(3000, 4000, this.allowSwitchSound, this);
        this.switchTimer.start();
        
        this.walkTimer = game.time.create(false);
        this.walkTimer.repeat(400, 100000, this.allowWalkSound, this); 
    },
    playWalkSound: function(){
        if(this.walkSoundAvailable == true){
           this.walkSoundAvailable = false;
           soundManager.playWalkSound();
           this.walkTimer.start();
           this.walk.play();
        }
    },
    explosionSound: function(){
        this.explodeSound.play();   
    },
    playBackgroundMusic(){
        this.mainSound.play();  
    },
    stopBackgroundMusic(){
        this.mainSound.stop();  
    },
    playSwitchSound: function(){
        if(this.switchSoundAvailable == true){
            this.switchSound.play();
            this.switchSoundAvailable = false;
        }
    },
    allowSwitchSound: function(){
        this.switchSoundAvailable = true;
        console.log("switch sound available");
    },
    allowWalkSound : function(){
        this.walkSoundAvailable = true;
    },
    playeDamageSound: function(){
        this.damageSound.play();
    }
}