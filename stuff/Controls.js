var Controls = function () { };
Controls.prototype = {
    addButtons: function (text, callback) {
        var buttons = game.add.text(20, (this.options * 20) + 50, text, style.navitem.default);
        buttons.inputEnabled = true;
        buttons.events.onInputUp.add(callback);
        buttons.events.onInputOver.add(function (target) {
            target.setStyle(style.navitem.hover);
        });
        buttons.events.onInputOut.add(function (target) {
            target.setStyle(style.navitem.default);
        });
        this.options++;
    },
    preload: function () {
        this.options = 1;
    },
    create: function () {
        game.add.sprite(0, 0, 'controls');
        this.addButtons('Back', function (target) {
            game.state.start('GameMenu');
        });
    },
}