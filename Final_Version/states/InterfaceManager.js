var interfaceManager = {
    
    currentLives: 5,
    hearts: null,
    energyCount: 5,
    setPlayer: function(currentPlayer){
        this.player = currentPlayer;
    },
    setGame: function(currentGameObject){
        this.game = currentGameObject;
    },
    setUpHelpMenu: function(){
        // will be moved to a future init() method
        this.MonsterTimer = game.time.create(false);
        this.EnergyTimer = game.time.create(false);
        this.EnergyTimer.loop(2000, this.gainEnergy, this);
        this.EnergyTimer.start();
        this.monsterEnable = true;
        
        this.helpMenuArray = [];
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
        
        this.helpMenu = game.input.keyboard.addKey(Phaser.Keyboard.H);
        
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
    },
    addSpell: function(spellName){
        this.helpMenu3 = this.game.add.sprite(100,50,spellName);
        this.helpMenu3.visible = false;
        this.helpMenuArray[this.helpMenuArray.length] = this.helpMenu3;
        this.helpMenu3.fixedToCamera = true;
    },
    displayOverlay: function(){
        //var overlay = this.game.add.sprite(0,0,'overlay');
        //overlay.fixedToCamera = true;
        // initialize the hearts for lives
        this.hearts = game.add.group();
        this.energy = game.add.group();
    },
    setHealth: function(lives){
        this.hearts.enableBody = true;
        for (var i = 0; i < lives; i++)
        {
            var heart = this.hearts.create(470 + 40*i,700,'heart');
            heart.fixedToCamera = true;
        }
        this.currentLives = lives;
    },
    playerTakeDamage: function(){
        if(this.monsterEnable == true){
            soundManager.playeDamageSound();
            this.hearts.callAll('kill');
            this.currentLives = this.currentLives - 1;
            this.setHealth(this.currentLives); 
            if(this.currentLives <= 0){
                this.monsterEnable = false;
                this.MonsterTimer.loop(1000, this.showDeathText, this);
                return;
            }
            
            //  Set a TimerEvent to occur after 2 seconds
            this.MonsterTimer.destroy();
            this.MonsterTimer.loop(1000, this.enableMonsters, this);
            this.MonsterTimer.start();
            this.monsterEnable = false;
        }
    },
    getEnergyCount: function(){
        return this.energyCount;  
    },
    setEnergy: function(){
        this.energy.callAll('kill');
        this.energy.enableBody = true;
        this.energy = game.add.group();
        for (var i = 0; i < this.energyCount; i++)
        {
            var energy = this.energy.create(470 + 40*i,750,'energyFull');
            energy.fixedToCamera = true;
        }
        for(var i = 0; i < (10 - this.energyCount); i++){
            var energy = this.energy.create(470 + 40*(i+this.energyCount) ,750 ,'energyEmpty');
            energy.fixedToCamera = true;
        }
    },
    reduceEnergy: function(){
        this.energyCount--;
        this.setEnergy();
    },
    getCurrentLives: function(){
        return this.currentLives;   
    },
    setCurrentLives: function(currentLives){
        this.currentLives = currentLives;  
    },
    showDeathText: function(){
           this.game.add.sprite(this.player.x- 400 ,this.player.y - 100,'deathText');
    },
    enableMonsters: function(){
      this.monsterEnable = true;  
    },
    setLives: function(newLives){
        this.currentLives = newLives;   
    },
    gainEnergy: function(){
        if(this.energyCount < 10){
            this.energyCount++;
            this.setEnergy();
        }
    }
}