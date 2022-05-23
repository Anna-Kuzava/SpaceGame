import * as PIXI from 'pixi.js';

export class GameScene {
    constructor(gameScene, enemyCount, level, width, height) {
    //initialize variables with default or parameter values
        this.gameScene = gameScene;
        this.width = width;
        this.height = height;
        this.enemyCount = enemyCount;
        this.level = level;
        this.palyersContainer = new PIXI.Container();
        this.bulletsContainer = new PIXI.Container();
        this.enemiesContainer = new PIXI.Container();
        if(this.level === 5){
            this.bossContainer = new PIXI.Container();
            this.bossBulletsContainer = new PIXI.Container();
        }
    }

    setUpScene(){
        this.gameScene.addChild(this.playersContainer);
        this.gameScene.addChild(this.bulletsContainer);
        if(this.level === 5){
            this.gameScene.addChild(this.bossContainer);
            this.gameScene.addChild(this.bossBulletsContainer);
        }

    }
    //creating different layers for player, enemies and bullets and adding then to the scene




//     const enemies = new PIXI.Container();
//     gameScene.addChild(enemies);

//     //creating player sprite and setting initial position
//     const sprite = new Player(spriteX, spriteY, playerTexture);
//     players.addChild(sprite);

//     //creating background for the text
//     const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
//     txtBG.width = 160;
//     txtBG.height = 40;
//     txtBG.position.x = 5;
//     txtBG.position.y = 5;
//     gameScene.addChild(txtBG);	

//     //text field for score
//     const styleScore = new PIXI.TextStyle({ fill: "#4b69fa", fontSize: 16, backgroundColor: "#000000"});
//     const scoreText = new TextField(`Score: ${score}`, styleScore, 5,5);
//     gameScene.addChild( scoreText);	

//     //text field for level
//     const styleLevel = new PIXI.TextStyle({ fill: "#fff126", fontSize: 16 });
//     const levelText = new TextField(`Level: ${_level}`, styleLevel, 440, 5);
//     gameScene.addChild(levelText);

//     //text field for health
//     const styleHealth = new PIXI.TextStyle({ fill: "#de2d1d", fontSize: 16 });
//     const healthText = new TextField(`Health: ${sprite.health}`, styleHealth, 5, 20);
//     gameScene.addChild(healthText);

//     //if level 5 (last level) add boss enemy
//     const boss = new BossEnemy(250, 50, bossTexture, 10);
//     if(_level === 5){
//         mainBossContainer.addChild(boss);
//     }

//     //creating enemy sprites and adding to the scene
//     for (let index = 0; index < enemyCount; index++) {
//         let x = Math.floor(Math.random() * 800);
//         let y = Math.floor(Math.random() * 250);
//         const enemy = new Enemy(x, y, enemyTexture);
//         enemies.addChild(enemy);
//     }

//     //creating event listeners for mouse and keys
//     document.onkeydown = (event) => {
//         keysMaps[event.code] = true;
//     };
//     document.onkeyup = (event) => {
//         keysMaps[event.code] = false;
//     };
//     document.onmousedown = (event) => {
//         isMouseFlag = true;
//     };
//     document.onmouseup = (event) => {
//         isMouseFlag = false;
//     };

    
//     return (delay) => {
//         //checks if any keys for movement were pressed and if so moves the sprite 
//         if (keysMaps['ArrowLeft']) {
//             sprite.moveLeft(delay);
//         }
//         if (keysMaps['ArrowRight']) {
//             sprite.moveRight(delay, canvasWidth);
//         }
//         if (keysMaps['ArrowUp']) {
//             sprite.moveUp(delay);	
//         }
//         if (keysMaps['ArrowDown']) {
//             sprite.moveDown(delay, canvasHeight);
//         }

//         //checks if the mouse key is presed and if can, shoots a bullet
//         if (isMouseFlag) {
//             if (sprite.canShoot()) {
//                 const bullet = new Bullet(sprite.position.x, sprite.position.y, bulletTexture, 15, 0.25);
//                 bullets.addChild(bullet);
//             }
//         }

//         //moves the bullet, checks for being outside the boundaries and checks if it hit anything
//         for (const bullet of bullets.children) {
//             bullet.moveUp(delay);

//             //if bullet outside of the canvas, remove it
//             if (bullet.position.y < 0) {
//                 bullets.removeChild(bullet);
//                 continue;
//             }

//             for (const enemy of enemies.children) {
//                 //if the bullet hit the enemy, remove the enemy
//                 if (enemy.getBounds().intersects(bullet.getBounds())) {
//                     enemies.removeChild(enemy);
//                     bullets.removeChild(bullet);
//                     updateScore(score, scoreText);
//                     if(score % 20 == 0){
//                         sprite.gainLife();
//                         healthText.setText(`Health: ${sprite.health}`);
//                     }

//                     if(enemies.children.length === 0 && _level === 5 && sprite.health !== 0 && boss.health === 0){
//                         win(score);
//                     }
//                     //check for next level condition
//                     else if(enemies.children.length === 0 && sprite.health !== 0){
//                         loadNextLevel(gameScene,  _enemyCount, _level, sprite.position.x, sprite.position.y);
//                     }
//                 }
//             }
//             if(_level === 5 && boss.health !== 0){
//                 if(boss.getBounds().intersects(bullet.getBounds())){
//                     boss.takeHit();
//                     bullets.removeChild(bullet);
//                     score++;
//                     if(boss.health===0){
//                         mainBossContainer.removeChild(boss);
//                     }
//                 }
//             }
//         }

//         if(_level === 5){
//             if(boss.position.x < sprite.position.x && boss.position.x < canvasWidth - 100){
//                 boss.position.x +=1;
//             }else if(boss.position.x > 100 && boss.position.x > sprite.position.x){
//                 boss.position.x -=1;
//             }
//             if(boss.canShoot()){
//                 const bullet = new Bullet(boss.position.x - 50, boss.position.y, bulletTexture, 3, 0.35);
//                 bullet.tint = 0x32a852;
//                 bossBullets.addChild(bullet);
//                 const bullet2 = new Bullet(boss.position.x + 50, boss.position.y, bulletTexture, 3, 0.35);
//                 bullet2.tint = 0x32a852;
//                 bossBullets.addChild(bullet2);
//             }
            
//             for(const bullet of bossBullets.children){
//                 bullet.moveDown(delay);
//                 if(bullet.position.y > canvasHeight){
//                     bossBullets.removeChild(bullet);
//                 }
//                 if(sprite.getBounds().intersects(bullet.getBounds())){
//                     sprite.takeHit();
//                     bossBullets.removeChild(bullet);
//                     healthText.text = `Health: ${sprite.health}`;
//                     if(sprite.health === 0){
//                         gameOver(score, _level);
//                     }
//                 }
//             }
//         }

//         //moves enemies nad resets postion if they are outside the boundaries
//         for (const enemy of enemies.children) {
//             enemy.moveDown(delay);
//             //resets position
//             if(enemy.position.y > (canvasHeight + 20)){
//                 enemy.position.x = Math.floor(Math.random() * 800);
//                 enemy.position.y = Math.floor(Math.random() * 25);
//             }
//             //if they hit the player sprite, health goes down, sprite becomes transparent and if helath is zero then game over.
//             if (enemy.getBounds().intersects(sprite.getBounds())) {
//                     sprite.takeHit();
//                     enemies.removeChild(enemy);
//                     healthText.text = `Health: ${sprite.health}`;
//                     ///checks for lose condition
//                     if(sprite.health == 0){
//                         gameOver(score, _level);
//                     }
//                     //checks for win condition
//                     else if(enemies.children.length === 0 && _level === 5){
//                         win(score);
//                     }
//                     //checks for next level condition
//                     else if(enemies.children.length === 0){
//                         loadNextLevel(gameScene,  _enemyCount, _level, sprite.position.x, sprite.position.y);
//                     }
//             }
//         }
//     };
// }
}