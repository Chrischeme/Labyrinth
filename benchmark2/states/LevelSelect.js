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

    preload: function(){
        this.lvloptions = 1;
    },
    create: function () {
        game.add.sprite(0, 0, 'placeholder');
        this.addLevels('Level 1', function (target) {
            game.state.start('Game');
        });
        this.addLevels('Back', function (target) {
            game.state.start('GameMenu');
        })
    },

}