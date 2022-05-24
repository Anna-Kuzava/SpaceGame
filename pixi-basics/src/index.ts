import { Player } from "./Player";
import { Enemy, BossEnemy} from "./Enemy";
import { TextField } from "./TextField";
import { Bullet } from  "./Bullet";
import * as PIXI from 'pixi.js';

const canvas = document.querySelector("canvas");
			const canvasWidth = 850;
			const canvasHeight = 550;
			const app = new PIXI.Application({
				view: canvas,
				width: canvasWidth,
				height: canvasHeight,
			});

		
			//creating textures for sprites
			const playerTexture = PIXI.Texture.from('./resources/player.png');
			const enemyTexture =  PIXI.Texture.from('./resources/enemy.png');
			const bossTexture =  PIXI.Texture.from('./resources/boss.png');
			const bulletTexture =  PIXI.Texture.from('./resources/bullet.png');

			//initializing some 
			let score = 0;

			//creating background layer and adding it to stage 
			const backGround = new PIXI.Container();
			const backSprite = PIXI.Sprite.from("resources/back.jpeg");
			backSprite.position.x = 0;
			backSprite.position.y = 0;
			backGround.addChild(backSprite);
			app.stage.addChild(backGround);

			//function that creates game scene and takes paramters in order to set level difficulties
			function createGameScene(gameScene:PIXI.Container, _enemyCount:number, _level:number, weaponLevel = 1, spriteX=250, spriteY=450) {
				//initialize variables with default or parameter values
				let isMouseFlag = false;
				const keysMaps = {};
				const enemyCount = _enemyCount;
				const weaponTimeSpawn = 7000;
				let start = Date.now();

				//creating different layers for player, enemies and bullets and adding then to the scene
				const players = new PIXI.Container();
				gameScene.addChild(players);
				
				const weaponContainer = new PIXI.Container();
				gameScene.addChild(weaponContainer);

				const bullets = new PIXI.Container();
				gameScene.addChild(bullets);
				
				const bossBullets = new PIXI.Container();
				const mainBossContainer = new PIXI.Container();
				if(_level === 5){
					gameScene.addChild(mainBossContainer);
					gameScene.addChild(bossBullets);
				}

				const enemies = new PIXI.Container();
				gameScene.addChild(enemies);

				//creating player sprite and setting initial position
				const sprite = new Player(spriteX, spriteY, playerTexture);
				sprite.weaponLevel = weaponLevel;
				players.addChild(sprite);

				//creating background for the text
				const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
				txtBG.width = 160;
				txtBG.height = 40;
				txtBG.position.x = 5;
				txtBG.position.y = 5;
				gameScene.addChild(txtBG);	

				//text field for score
				const styleScore = new PIXI.TextStyle({ fill: "#4b69fa", fontSize: 16 });
				const scoreText = new TextField(`Score: ${score}`, styleScore, 5,5);
				gameScene.addChild( scoreText);	

				//text field for level
				const styleLevel = new PIXI.TextStyle({ fill: "#fff126", fontSize: 16 });
				const levelText = new TextField(`Level: ${_level}`, styleLevel, 440, 5);
				gameScene.addChild(levelText);

				//text field for health
				const styleHealth = new PIXI.TextStyle({ fill: "#de2d1d", fontSize: 16 });
				const healthText = new TextField(`Health: ${sprite.health}`, styleHealth, 5, 20);
				gameScene.addChild(healthText);

				//if level 5 (last level) add boss enemy
				const boss = new BossEnemy(250, 50, bossTexture, 10);
				if(_level === 5){
					mainBossContainer.addChild(boss);
				}

				//creating enemy sprites and adding to the scene
				for (let index = 0; index < enemyCount; index++) {
					let x = Math.floor(Math.random() * 800);
					let y = Math.floor(Math.random() * 250);
					const enemy = new Enemy(x, y, enemyTexture);
					enemies.addChild(enemy);
				}
	
				//creating event listeners for mouse and keys
				document.onkeydown = (event) => {
					keysMaps[event.code] = true;
				};
				document.onkeyup = (event) => {
					keysMaps[event.code] = false;
				};
				document.onmousedown = (event) => {
					isMouseFlag = true;
				};
				document.onmouseup = (event) => {
					isMouseFlag = false;
				};

				
				let weapon:PIXI.Sprite|null = null; 
				
				return (delay:number) => {
					//checks if any keys for movement were pressed and if so moves the sprite 
					if (keysMaps['ArrowLeft']) {
						sprite.moveLeft(delay);
					}
					if (keysMaps['ArrowRight']) {
						sprite.moveRight(delay, canvasWidth);
					}
					if (keysMaps['ArrowUp']) {
						sprite.moveUp(delay);	
					}
					if (keysMaps['ArrowDown']) {
						sprite.moveDown(delay, canvasHeight);
					}


					//checks if the mouse key is presed and if can, shoots a bullet
					if (isMouseFlag) {
						let canShoot = sprite.canShoot();
						if ((canShoot && sprite.weaponLevel === 1)) {
							const bullet = new Bullet(sprite.position.x, sprite.position.y, bulletTexture, 15, 0.25);
							bullets.addChild(bullet);
						}
						else if((canShoot && sprite.weaponLevel === 2)){
							const bullet = new Bullet(sprite.position.x-5, sprite.position.y, bulletTexture, 15, 0.25);
							bullets.addChild(bullet);
							const bullet2 = new Bullet(sprite.position.x+5, sprite.position.y, bulletTexture, 15, 0.25);
							bullets.addChild(bullet2);
						}
						else if(canShoot && sprite.weaponLevel >= 3){
							const bullet = new Bullet(sprite.position.x-7, sprite.position.y, bulletTexture, 15, 0.25);
							bullets.addChild(bullet);
							const bullet2 = new Bullet(sprite.position.x+7, sprite.position.y, bulletTexture, 15, 0.25);
							bullets.addChild(bullet2);
							const bullet3 = new Bullet(sprite.position.x, sprite.position.y, bulletTexture, 15, 0.25);
							bullets.addChild(bullet3);
						}
					}

					//moves the bullet, checks for being outside the boundaries and checks if it hit anything
					for (const bullet of bullets.children as Array<Bullet>) {
						bullet.moveUp(delay);

						//if bullet outside of the canvas, remove it
						if (bullet.position.y < 0) {
							bullets.removeChild(bullet);
							continue;
						}

						for (const enemy of enemies.children as Array<Enemy>) {
							//if the bullet hit the enemy, remove the enemy
							if (enemy.getBounds().intersects(bullet.getBounds())) {
								enemies.removeChild(enemy);
								bullets.removeChild(bullet);
								score++;
								scoreText.setText(`Score: ${score}`);
								if(score % 20 == 0){
									sprite.gainLife();
									healthText.setText(`Health: ${sprite.health}`);
								}

								if(enemies.children.length === 0 && _level === 5 && sprite.health !== 0 && boss.health === 0){
									win(score);
								}
								//check for next level condition
								else if(enemies.children.length === 0 && sprite.health !== 0){
									loadNextLevel(gameScene,  _enemyCount, _level, sprite.position.x, sprite.position.y, sprite.weaponLevel);
								}
							}
						}
						if(_level === 5 && boss.health !== 0){
							if(boss.getBounds().intersects(bullet.getBounds())){
								boss.takeHit();
								bullets.removeChild(bullet);
								score++;
								scoreText.setText(`Score: ${score}`);
								if(boss.health===0){
									mainBossContainer.removeChild(boss);
								}
							}
						}
					}

					if(_level === 5){
						if(boss.position.x < sprite.position.x && boss.position.x < canvasWidth - 100){
							boss.position.x +=1;
						}else if(boss.position.x > 100 && boss.position.x > sprite.position.x){
							boss.position.x -=1;
						}
						if(boss.canShoot()){
							const bullet = new Bullet(boss.position.x - 50, boss.position.y, bulletTexture, 3, 0.35);
							bullet.tint = 0x32a852;
							bossBullets.addChild(bullet);
							const bullet2 = new Bullet(boss.position.x + 50, boss.position.y, bulletTexture, 3, 0.35);
							bullet2.tint = 0x32a852;
							bossBullets.addChild(bullet2);
						}
						
						for(const bullet of bossBullets.children as Array<Bullet>){
							bullet.moveDown(delay);
							if(bullet.position.y > canvasHeight){
								bossBullets.removeChild(bullet);
							}
							if(sprite.getBounds().intersects(bullet.getBounds())){
								sprite.takeHit();
								bossBullets.removeChild(bullet);
								healthText.text = `Health: ${sprite.health}`;
								if(sprite.health === 0){
									gameOver(score, _level);
								}
							}
						}
					}

					//moves enemies nad resets postion if they are outside the boundaries
					for (const enemy of enemies.children as Array<Enemy>) {
						enemy.moveDown(delay);
						//resets position
						if(enemy.position.y > (canvasHeight + 20)){
							enemy.position.x = Math.floor(Math.random() * 800);
							enemy.position.y = Math.floor(Math.random() * 25);
						}
						//if they hit the player sprite, health goes down, sprite becomes transparent and if helath is zero then game over.
						if (enemy.getBounds().intersects(sprite.getBounds())) {
								sprite.takeHit();
								enemies.removeChild(enemy);
								healthText.text = `Health: ${sprite.health}`;
								///checks for lose condition
								if(sprite.health == 0){
									gameOver(score, _level);
								}
								//checks for win condition
								else if(enemies.children.length === 0 && _level === 5){
									win(score);
								}
								//checks for next level condition
								else if(enemies.children.length === 0){
									loadNextLevel(gameScene,  _enemyCount, _level, sprite.position.x, sprite.position.y, sprite.weaponLevel);
								}
						}
					}


					let current = Date.now();
					
					if(current - start > weaponTimeSpawn){
						weapon = PIXI.Sprite.from("resources/fire.png");
						weapon.position.x = Math.floor(Math.random() * 800);
						weapon.width = 40;
						weapon.height = 40;
						weapon.position.y = 0;
						start = current;
						weaponContainer.addChild(weapon);
					}
					if(weapon !== null){
						weapon.position.y += 3;
						if(weapon.position.y > canvasHeight){
							weaponContainer.removeChild(weapon);
							weapon = null;
						}
						else if(weapon.getBounds().intersects(sprite.getBounds())){
							weaponContainer.removeChild(weapon);
							sprite.increaseWeapon();
							weapon = null;
						}
					}
				};
			}

			function gameOver(score:number, level:number){
				app.stage.removeChild(gameScene);
				const gameOverScene = new PIXI.Container();
				app.stage.addChild(gameOverScene);
				state="lost";
				createGameOverScene(gameOverScene, score, level)
			}

			function win(score:number){
				app.stage.removeChild(gameScene);
				state="win";
				const winScene = new PIXI.Container();
				app.stage.addChild(winScene);
				createWinScene(winScene, score);
			}

			function loadNextLevel(gameScene:PIXI.Container, enemyCount:number, level:number, x:number, y:number, weaponLevel:number){
				app.stage.removeChild(gameScene);
				gameScene = new PIXI.Container();
				updateScene = createGameScene(gameScene, enemyCount+=5,  level+=1,weaponLevel, x, y);
				app.stage.addChild(gameScene);	
			}
			//creates win scene
			function createWinScene(winScene:PIXI.Container, score:number){
				const style = new PIXI.TextStyle({ fill: "#fff126", fontSize: 20 });
				const scoreText = new PIXI.Text(`Congrats! You Win! Score: ${score}`, style);
				scoreText.scale.x = 2;
				scoreText.position.x = 35;
				scoreText.position.y = 250;
				winScene.addChild(scoreText);	
			}

			//creates lose scene
			function createGameOverScene(gameOverScene:PIXI.Container, score:number, level:number){
				const style = new PIXI.TextStyle({ fill: "#fff126", fontSize: 20 });
				const scoreText = new PIXI.Text(`Game Over. Last level: ${level}. Score ${score}`, style);
				scoreText.scale.x = 2;
				scoreText.position.x = 100;
				scoreText.position.y = 250;
				gameOverScene.addChild(scoreText);	
			}


			
			//initializes game scene
			let gameScene = new PIXI.Container();
			let updateScene = createGameScene(gameScene,  10,  1);

			//creating the first start game scene
			let state = "mainMenu";
			const mainScene = new PIXI.Container();
			const style = new PIXI.TextStyle({ fill: "#fff126", fontSize: 28 });
			const field:PIXI.Text = new PIXI.Text("Start Game", style);
			field.interactive = true;
			field.buttonMode = true;
			field.scale.x = 2;
			field.position.x = 250;
			field.position.y = 250;
			mainScene.addChild(field);
			field.on('click', () => {
				state = "game";
				app.stage.removeChild(mainScene);
				app.stage.addChild(gameScene);
			});
			app.stage.addChild(mainScene);

			app.ticker.add(
				(delay) => {
					if (state === "game") {
						updateScene(delay);
					}else if(state === "win"){
						//not sure what goes here
					}else if(state==="lost"){
					}
				}
			);