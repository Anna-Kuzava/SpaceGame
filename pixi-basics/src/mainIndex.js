import * as PIXI from "pixi.js";			
            
            //getting canvas from HTML and setting some parameters
			const canvas = document.querySelector("canvas");
			const canvasWidth = 850;
			const canvasHeight = 550;
			const app = new PIXI.Application({
				view: canvas,
				width: canvasWidth,
				height: canvasHeight,
			});

			//initializing some 
			let health = 3;
			let score = 0;

			const BossEnemy = {
				health:10,
				sprite: "resources/boss.png"
			};

			//creating background layer and adding it to stage 
			const backGround = new PIXI.Container();
			const backSprite = PIXI.Sprite.from("resources/back.jpeg");
			backSprite.position.x = 0;
			backSprite.position.y = 0;
			backGround.addChild(backSprite);
			app.stage.addChild(backGround);

			//function that creates game scene and takes paramters in order to set level difficulties
			function createGameScene(gameScene, _speed, _enemyCount, _speedSpawn, _level, spriteX=250, spriteY=450) {
				//initialize variables with default or parameter values
				let isMouseFlag = false;
				let lastBulletSpawnTime = 0;
				let lastBossBulletSpawn = 0;
				let isHit = false;
				const spawnSpeed = _speedSpawn;
				const keysMaps = {};
				const speed = _speed;
				const bulletSpeed = 15;
				const enemyCount = _enemyCount;
				const hitTime = 500;
				let lastHitTime = 0;

				//creating different layers for player, enemies and bullets and adding then to the scene
				const players = new PIXI.Container();
				gameScene.addChild(players);

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
				const sprite = PIXI.Sprite.from("resources/player.png");
				sprite.position.x = spriteX;
				sprite.position.y = spriteY;
				players.addChild(sprite);

				//creating background for the text
				const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
				txtBG.width = 160;
				txtBG.height = 40;
				txtBG.position.x = 5;
				txtBG.position.y = 5;
				gameScene.addChild(txtBG);	

				//text field for score
				const styleScore = new PIXI.TextStyle({ fill: "#4b69fa", fontSize: 16, backgroundColor: "#000000"  });
				const scoreText = new PIXI.Text(`Score: ${score}`, styleScore);
				scoreText.scale.x = 2;
				scoreText.position.x = 5;
				scoreText.position.y = 5;
				gameScene.addChild( scoreText);	

				//text field for level
				const styleLevel = new PIXI.TextStyle({ fill: "#fff126", fontSize: 16 });
				const levelText = new PIXI.Text(`Level: ${_level}`, styleLevel);
				levelText.scale.x = 2;
				levelText.position.x = 440;
				levelText.position.y = 5;
				gameScene.addChild(levelText);

				//text field for health
				const styleHealth = new PIXI.TextStyle({ fill: "#de2d1d", fontSize: 16 });
				const healthText = new PIXI.Text(`Health: ${health}`, styleHealth);
				healthText.scale.x = 2;
				healthText.position.x = 5;
				healthText.position.y = 20;
				gameScene.addChild(healthText);


				//if level 5 (last level) add boss enemy
				const mainEnemy= PIXI.Sprite.from(BossEnemy.sprite);
				let posX, posY;
				if(_level === 5){
					mainEnemy.position.x =  250;
					mainEnemy.position.y =  50;
					mainEnemy.width = 200;
					mainEnemy.height = 150;
					mainEnemy.anchor.x = 0.5;
					mainEnemy.anchor.y = 0.5;

					mainEnemy.angle = 180;
					mainBossContainer.addChild(mainEnemy);
					console.log("enemy created");
					console.log(mainEnemy);
				}
				//creating enemy sprites and adding to the scene
				for (let index = 0; index < enemyCount; index++) {
					const enemy = PIXI.Sprite.from("resources/enemy.png");
					enemy.position.x =  Math.floor(Math.random() * 800);
					enemy.position.y =  Math.floor(Math.random() * 250);
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

			
				
				return (delay) => {
					//checks if any keys for movement were pressed and if so, and if the palyer sprtie won't end up outside of the visible area
					//then moves the sprite in the corresponding direction
					if (keysMaps['ArrowLeft']) {
						sprite.position.x -= delay * speed;
						if(sprite.position.x < 0){
							sprite.position.x = 0;
						}
					}
					if (keysMaps['ArrowRight']) {
						sprite.position.x += delay * speed;
						if(sprite.position.x > canvasWidth - 30){
							sprite.position.x = canvasWidth - 30;
						}
					}
					if (keysMaps['ArrowUp']) {
						sprite.position.y -= delay * speed;	
						if(sprite.position.y < 0){
							sprite.position.y = 0;
						}
					}
					if (keysMaps['ArrowDown']) {
						sprite.position.y += delay * speed;
						if(sprite.position.y > canvasHeight - 30){
							sprite.position.y = canvasHeight - 30;
						}
					}

					//checks if the mouse key is presed and if enough time has passed since the last bullet, then shoots a bullet
					if (isMouseFlag) {
						const currentTime = Date.now();
						if ((currentTime - lastBulletSpawnTime) > spawnSpeed) {
							const bullet = PIXI.Sprite.from("resources/bullet.png");
							bullet.position.x = sprite.position.x;
							bullet.position.y = sprite.position.y;
							bullet.scale.x = 0.25;
							bullet.scale.y = 0.25;
							bullets.addChild(bullet);
							lastBulletSpawnTime = currentTime;
						}
					}

					//if the player was hit, checks if the player should be not transparent any more
					if(isHit){
						const currentTime = Date.now();
						if ((currentTime - lastHitTime) > hitTime) {
							sprite.alpha = 1;
							isHit = false;
							lastHitTime = 0;
						}
					}

					//moves the bullet, checks for being outside the boundaries and checks if it hit anything
					for (let index = 0; index < bullets.children.length; index++) {
						const bullet = bullets.children[index];
						bullet.position.y -= bulletSpeed * delay;


						//if bullet outside of the canvas, remove it
						if (bullet.position.y < 0) {
							bullets.removeChild(bullet);
							continue;
						}

						for (const enemy of enemies.children) {
							//if the bullet hit the enemy, remove the enemy
							if (enemy.getBounds().intersects(bullet.getBounds())) {
								enemies.removeChild(enemy);
								bullets.removeChild(bullet);
								score++;
								if(score % 20 == 0){
									health++;
									healthText.text = `Health: ${health}`;
								}
								console.log(`Score: ${score}`);
								scoreText.text  =`Score: ${score}`;

								//check for win condition
								if(enemies.children.length === 0 && _level === 5 && health !== 0 && BossEnemy.health === 0){
									app.stage.removeChild(gameScene);
									state="win";
									const winScene = new PIXI.Container();
									app.stage.addChild(winScene);
									createWinScene(winScene, score);
								}
								//check for next level condition
								else if(enemies.children.length === 0 && health !== 0){
									app.stage.removeChild(gameScene);
									gameScene = new PIXI.Container();
									updateScene = createGameScene(gameScene, _speed+=2, _enemyCount+=5, _speedSpawn += 25, _level+=1, sprite.position.x, sprite.position.y);
									app.stage.addChild(gameScene);	
								}
							}
							
						}
						if(_level === 5 && BossEnemy.health !== 0){
							if(mainEnemy.getBounds().intersects(bullet.getBounds())){
								BossEnemy.health--;
								bullets.removeChild(bullet);
								score++;
								console.log(BossEnemy.health);
								if(BossEnemy.health===0){
									mainBossContainer.removeChild(mainEnemy);
								}
							}

							
						}
					}

					if(_level === 5){
						if(mainEnemy.position.x < sprite.position.x && mainEnemy.position.x < canvasWidth - 100){
							mainEnemy.position.x +=1;
						}else if(mainEnemy.position.x > 100 && mainEnemy.position.x > sprite.position.x){
							mainEnemy.position.x -=1;
						}
						const now = Date.now();
						if(now - lastBossBulletSpawn > 700 && BossEnemy.health !== 0){
						const bullet = PIXI.Sprite.from("resources/bullet.png");
							bullet.position.x = mainEnemy.position.x - 50;
							bullet.position.y = mainEnemy.position.y;
							bullet.tint = 0x32a852;
							bullet.scale.x = 0.35;
							bullet.scale.y = 0.35;
						bossBullets.addChild(bullet);
						const bullet2 = PIXI.Sprite.from("resources/bullet.png");
							bullet2.position.x = mainEnemy.position.x + 50;
							bullet2.position.y = mainEnemy.position.y;
							bullet2.tint = 0x32a852;
							bullet2.scale.x = 0.35;
							bullet2.scale.y = 0.35;
						bossBullets.addChild(bullet2);
						lastBossBulletSpawn = Date.now();
						}
						
						for(const bullet of bossBullets.children){
							bullet.position.y += 3;
							if(bullet.position.y > canvasHeight){
								bossBullets.removeChild(bullet);
							}
							if(sprite.getBounds().intersects(bullet.getBounds())){
								health--;
								bossBullets.removeChild(bullet);
								healthText.text = `Health: ${health}`;
								sprite.alpha = 0.5;
								isHit = true;
								lastHitTime = Date.now();	
								if(health == 0){
									//not sure if that;s the way to switch between the scenes
									app.stage.removeChild(gameScene);
									const gameOverScene = new PIXI.Container();
									app.stage.addChild(gameOverScene);
									state="lost";
									createGameOverScene(gameOverScene, score, _level)
								}
							}
						}
					}

					//moves enemies nad resets postion if they are outside the boundaries
					for (const enemy of enemies.children) {
						enemy.position.y += 2 * delay;
						//resets position
						if(enemy.position.y > (canvasHeight + 20)){
							enemy.position.x = Math.floor(Math.random() * 800);
							enemy.position.y = Math.floor(Math.random() * 25);
						}
						//if they hit the player sprite, health goes down, sprite becomes transparent and if helath is zero then game over.
						if (enemy.getBounds().intersects(sprite.getBounds())) {
								health--;
								enemies.removeChild(enemy);
								sprite.alpha = 0.5;
								isHit = true;
								lastHitTime = Date.now();
								healthText.text = `Health: ${health}`;
								///checks for lose condition
								if(health == 0){
									//not sure if that;s the way to switch between the scenes
									app.stage.removeChild(gameScene);
									const gameOverScene = new PIXI.Container();
									app.stage.addChild(gameOverScene);
									state="lost";
									createGameOverScene(gameOverScene, score, _level)
								}
								//checks for win condition
								else if(enemies.children.length === 0 && _level === 5){
									app.stage.removeChild(gameScene);
									state="win";
									const winScene = new PIXI.Container();
									app.stage.addChild(winScene);
									createWinScene(winScene, score);
								}
								//checks for next level condition
								else if(enemies.children.length === 0){
									app.stage.removeChild(gameScene);
									gameScene = new PIXI.Container();
									updateScene = createGameScene(gameScene, _speed+=2, _enemyCount+=5, _speedSpawn += 25, _level+=1, sprite.position.x, sprite.position.y);
									app.stage.addChild(gameScene);	
								}
						}
					}
				};
			}

			//creates win scene
			function createWinScene(winScene, _score){
				const style = new PIXI.TextStyle({ fill: "#fff126", fontSize: 20 });
				const scoreText = new PIXI.Text(`Congrats! You Win! Score: ${_score}`, style);
				scoreText.scale.x = 2;
				scoreText.position.x = 35;
				scoreText.position.y = 250;
				winScene.addChild(scoreText);	
			}

			//creates lose scene
			function createGameOverScene(gameOverScene, _score, _level){
				console.log(score);
				console.log(_level);
				const style = new PIXI.TextStyle({ fill: "#fff126", fontSize: 20 });
				const scoreText = new PIXI.Text(`Game Over. Last level: ${_level}. Score ${_score}`, style);
				scoreText.scale.x = 2;
				scoreText.position.x = 100;
				scoreText.position.y = 250;
				gameOverScene.addChild(scoreText);	
			}


			
			//initializes game scene
			let gameScene = new PIXI.Container();
			let updateScene = createGameScene(gameScene, 5, 10, 200, 5);

			//creating the first start game scene
			let state = "mainMenu";
			const mainScene = new PIXI.Container();
			const style = new PIXI.TextStyle({ fill: "#fff126", fontSize: 28 });
			const field = new PIXI.Text("Start Game", style);
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