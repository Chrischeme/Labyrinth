var Splash = function () { };
Splash.prototype = {

    loadScripts: function () {
        game.load.script('WebFont', 'vendor/webfontloader.js');
        game.load.script('GameMenu', 'states/GameMenu.js');
        game.load.script('Game', 'states/Game.js');
        game.load.script('Options', 'states/Options.js');
        game.load.script('Quit', 'states/Quit.js');
        game.load.script('Style', 'lib/style.js');
        game.load.script('LevelSelect', 'states/LevelSelect.js');
        game.load.script('LevelSelect1', 'states/LevelSelect1.js');
        game.load.script('LevelSelect2', 'states/LevelSelect2.js');
        game.load.script('Controls', 'states/Controls.js');
        game.load.script('Level2', 'states/level2.js');
        game.load.script('Game4', 'states/Game4.js');
        game.load.script('cheats', 'states/cheats.js');
        game.load.script('help', 'states/help.js');
        game.load.script('LevelSaver', 'states/LevelSaver.js');
        // add manager scripts to the program
        game.load.script('PlayerStateManager', 'states/PlayerStateManager.js');
        game.load.script('InterfaceManager', 'states/InterfaceManager.js');
        game.load.script('SoundManager',     'states/SoundManager.js');
        game.load.script('TextManager',      'states/TextManager.js');
        // add TutorialLevel Script
        game.load.script('TutorialLevel', 'states/TutorialLevel.js');
    },

    loadBgm: function () {
    },

    loadImages: function () {
        game.load.image('menu-bg', 'assets/images/menu-bg.jpg');
        game.load.image('options-bg', 'assets/images/options-bg.jpg');
        game.load.image('placeholder', 'assets/images/placeholder.jpg');
        game.load.image('overlay', 'assets/images/overlay.jpg');
        game.load.image('controls', 'assets/images/Controls.png');
        game.load.image('cheats', 'assets/images/cheats.png');
        game.load.image('help', 'assets/images/helpMenu.png');
        
        // for the help menu
        game.load.image('helpMenu1', 'assets/images/helpMenu1.png');
        game.load.image('helpMenu2', 'assets/images/helpMenu2.png');
        game.load.image('helpMenu3', 'assets/images/helpMenu3.png');
        game.load.image('helpMenu4', 'assets/images/helpMenu4.png');
        
        // Load Game Sounds
        game.load.audio('background', ['assets/bgm/background.mp3']);
        game.load.audio('explosionSound', ['assets/bgm/fire1.wav']);
        game.load.audio('walk', ['assets/bgm/walk.mp3']);
        game.load.audio('switch', ['assets/bgm/switch.mp3']);
        game.load.audio('ow', ['assets/bgm/ow.mp3']);
        
        //Load the Energy Bar
        game.load.image('energyFull', 'assets/images/EnergyFull.png');
        game.load.image('energyEmpty', 'assets/images/EnergyEmpty.png');
        //Bengy's Text Box
        game.load.image('bengyTextBox', 'assets/images/bengyTextBox.png', 128, 128);
        

    },

    loadFonts: function () {
        WebFontConfig = {
            custom: {
                families: ['ffType', 'ffTitle'],
                urls: ['assets/style/fftype.css', 'assets/style/ffTitle.css']
            }
        }
    },
    init: function () {
        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 400, "loading");
        this.logo = game.make.sprite(game.world.centerX, 200, 'logo');
        this.status = game.make.text(game.world.centerX, 380, 'Loading...', { fill: 'white' });
        this.logo.inputEnabled = true;
        utils.centerGameObjects([this.logo, this.status]);
        
    },

    preload: function () {
        game.add.sprite(0, 0, 'SplashScreen');
        game.add.existing(this.logo).scale.setTo(0.3);
        game.add.existing(this.logo).alpha = 0;
        game.add.tween(this.logo).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);
        this.loadScripts();
        this.loadImages();
        this.loadFonts();
        this.loadBgm();
    },
    addGameStates: function () {
        game.state.add("GameMenu", GameMenu);
        game.state.add("LevelSelect", LevelSelect);
        game.state.add("LevelSelect1", LevelSelect1);
        game.state.add("LevelSelect2", LevelSelect2);
        game.state.add("Quit", Quits);
        game.state.add("Options", Options);
        game.state.add("Game", Game);
        game.state.add("Controls", Controls);
        game.state.add('Level2', Level2);
        game.state.add("Game4", Game4);
        game.state.add('help', help);
        game.state.add('cheats', cheats);
        game.state.add('TutorialLevel', TutorialLevel);
    },
    test: function(){
        console.log("You Clicked on the logo");
    },
    create: function () {
        this.status.setText('Continue!');
        this.addGameStates();
        this.logo.events.onInputDown.add(function () {
            game.state.start('GameMenu');
        });
    }
}