var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game'), Main = function () { };

Main.prototype = {
    preload: function () {
        game.load.image('background', 'assets/images/background.jpg');
        game.load.image('loading', 'assets/images/loading.png');
        game.load.image('logo', 'assets/images/logo.png');
        game.load.script('utils', 'lib/utils.js');
        game.load.script('splash', 'states/Splash.js');
        game.load.script('polyfill', 'lib/polyfill.js');
        game.load.image('SplashScreen', 'assets/images/SplashScreen.png');
        game.load.image('MenuScreen', 'assets/images/MenuScreen.png');
        
//        game.load.tilemap('tutorial_map', 'assets/tilesheet/tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
//        game.load.image('tilesheet', 'assets/tilesheet/tilesheet.png');
//        game.load.image('player', 'assets/images/player.png');
        
    },

    create: function () {
        game.state.add('splash', Splash);
        game.state.start('splash');
    }

};

game.state.add('Main', Main);
game.state.start('Main');