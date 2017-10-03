var game;
function createGame() {
    game = new Phaser.Game(900, 400, Phaser.AUTO, 'QWETest', { preload: preload, create: create, update: update});
}

function preload() {
    game.load.image('bubble', 'assets/bubble.png');
    game.load.image('background', 'assets/background.png');
    game.load.image('firebolt', 'assets/firebolt.png');
}

var background;
var bubble1;
var bubble2;
var bubble3;
var b1T;
var b2T;
var b3T;
var text;
var bubbleArray = ['', '', ''];
var keyQ;
var keyW;
var keyE;
var projectiles;

function create() {
    background = game.add.sprite(0,0,'background');
    bubble1 = game.add.sprite(0, 0, 'bubble');
    bubble2 = game.add.sprite(300, 0, 'bubble');
    bubble3 = game.add.sprite(600, 0, 'bubble');

// Letters inside the bubbles
    b1T = game.add.text(113, 103, '', { fontSize: '50px', fill: '#000' });
    b2T = game.add.text(413, 103, '', { fontSize: '50px', fill: '#000' });
    b3T = game.add.text(713, 103, '', { fontSize: '50px', fill: '#000' });
// Combo after bubbles fill up 
    text = game.add.text(300, 300, '', { fontSize: '50px', fill: '#000' });
// Key input/listeners
    keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyQ.onDown.add(function() {
        if (bubbleArray[0] === '') {
            bubbleArray[0] = 'Q';
        }
        else if (bubbleArray[1] === '') {
            bubbleArray[1] = 'Q';
        }
        else if (bubbleArray[2] === '') {
            bubbleArray[2] = 'Q';
        }
    }, this);
    keyW.onDown.add(function() {
       if (bubbleArray[0] === '') {
            bubbleArray[0] = 'W';
        }
        else if (bubbleArray[1] === '') {
            bubbleArray[1] = 'W';
        }
        else if (bubbleArray[2] === '') {
            bubbleArray[2] = 'W';
        }
    }, this);
    keyE.onDown.add(function() {
       if (bubbleArray[0] === '') {
            bubbleArray[0] = 'E';
        }
        else if (bubbleArray[1] === '') {
            bubbleArray[1] = 'E';
        }
        else if (bubbleArray[2] === '') {
            bubbleArray[2] = 'E';
        }
    }, this);
}

function update() {
    // if bubbleArray (our 3 key combos) fill up, run this 
    if (bubbleArray[2] != '') {
        // if statements that check what the key combo was (if QQQ --> firebolt())
        if (bubbleArray[0] === 'Q') {
            if (bubbleArray[1] === 'Q') {
                if (bubbleArray[2] === 'Q') {
                    firebolt();
                }
            }
        }
        // output what the key combo was, then reset it to empty strings
        text.text = bubbleArray[0] + ' ' + bubbleArray[1] + ' ' + bubbleArray[2];
        bubbleArray = ['', '', ''];
    }

    // keep running, set current bubble letters (UI) to match data
    b1T.text = bubbleArray[0];
    b2T.text = bubbleArray[1];
    b3T.text = bubbleArray[2];
}

function firebolt() {
    // run when firebolt() happens, 
    // ** NEED TO CHANGE ** the x and y where it spawns should be player.x/player.y
    // also maybe need to kill/destroy sprite?
    var firebolt = game.add.sprite(game.world.centerX, game.world.centerY, 'firebolt');
    game.physics.enable(firebolt, Phaser.Physics.ARCADE);
    firebolt.rotation = game.physics.arcade.moveToPointer(firebolt, 400);
    //  ** NEED TO ADD ** should play animation of player casting fireball
}