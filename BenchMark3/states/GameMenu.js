var GameMenu = function () { };
var level2Unlocked = false;
GameMenu.prototype = {
    addMenuOption: function (text, callback) {
        var txt = game.add.text(30, (this.optionCount * 30) + 400, text, style.navitem.default);
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback);
        txt.events.onInputOver.add(function (target) {
            target.setStyle(style.navitem.hover);
        });
        txt.events.onInputOut.add(function (target) {
            target.setStyle(style.navitem.default);
        });
        this.optionCount++;
    },
    init: function () {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY-300, "LABYRINTH", {
            font: '50pt ffTitle',
            fill: '#RRGGBB',
            align: 'center',
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.titleText.stroke = "#FFFFFF";
        this.titleText.strokeThickness = 1;
        this.optionCount = 1;
    },
    preload: function () {
        this.optionCount = 1;
    },
    create: function () {
        game.add.sprite(0, 0, 'MenuScreen');
        game.add.existing(this.titleText)

        this.addMenuOption('Start', function (target) {
            game.state.start('LevelSelect');
        });
        this.addMenuOption('Help', function (target) {
            game.state.start('help');
        });
        this.addMenuOption('Cheats Help', function (target) {
            game.state.start('cheats');
        });
        this.addMenuOption('Controls', function (target) {
            game.state.start("Controls");
        });
        this.addMenuOption('Quit', function (target) {
            game.state.start('splash');
        });
    }
}