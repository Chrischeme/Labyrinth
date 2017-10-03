function LevelSaver(levelCode, game){
    this.levelCode = generateCode();
    console.log(this.levelCode);
    return this.levelCode;
}
function setLevelCode(levelCode){
    this.levelCode = levelCode;   
}
function getLevelCode(){
    return this.levelCode;
}
function logLevelCode(){
    var code = getLevelCode();
    console.log(code);   
}
function generateCode(){
    var code  = Math.random() * 100000;
    code = Math.floor(code) + 100000;
    return code;
}