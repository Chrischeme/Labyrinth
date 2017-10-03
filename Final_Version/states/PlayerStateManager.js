var playerStateManager = {
    state: "player",
    health: 3,
    player: null,
    game: null,
    getHealth: function(){
        console.log(this.health);
        return this.health;
    },
    setPlayer: function(currentPlayer){
        this.player = currentPlayer;
    },
    setGame: function(currentGameObject){
        this.game = currentGameObject;
    },
    reducePlayerHealth: function(){
        this.health--;
    },
    getState: function(){
        return this.state;  
    },
    playerUpdate(){
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    },
    bengyState(){
        this.state = "bengy";   
        console.log("now in bengy state");
    },
    deathState(){
        this.state = "death";   
        console.log("now in death state");
    },
    playerState(){
        this.state = "player";
        console.log("now in player state");
    }
}