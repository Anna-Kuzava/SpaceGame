import * as PIXI from 'pixi.js';

export class Player extends PIXI.Sprite{
    health:number;
    speed:number;
    shootingSpeed:number;
    lastShot:number;
    weaponLevel:number;
    constructor(x:number, y:number, texture:PIXI.Texture){
        super(texture);
        this.position.x = x;
        this.position.y = y;
        this.health = 3;
        this.speed = 5;
        this.shootingSpeed = 200;
        this.lastShot = Date.now();
        this.weaponLevel = 1;
    }

    looseLife(){
        this.health--;
    }

    gainLife(){
        this.health++;
    }

    moveLeft(delay:number){
        this.position.x -= delay * this.speed;
        if(this.position.x < 0){
            this.position.x = 0;
        }
    }

    moveRight(delay:number, canvasWidth:number){
        this.position.x += delay * this.speed;
        if(this.position.x > canvasWidth - 30){
            this.position.x = canvasWidth - 30;
        }
    }

    moveUp(delay:number){
        this.position.y -= delay * this.speed; 
        if(this.position.y < 0){
            this.position.y = 0;
        }
    }

    moveDown(delay:number, canvasHeight:number){
        this.position.y += delay * this.speed;
        if(this.position.y > canvasHeight - 30){
            this.position.y = canvasHeight - 30;
        }
    }
    
    takeHit(){
        this.looseLife();
        this.alpha = 0.5;
        setTimeout(()=>{this.alpha = 1;}, 500);
    }
    
    canShoot():boolean{
        let currentTime:number = Date.now();
        if(currentTime - this.lastShot > this.shootingSpeed){
            this.lastShot = currentTime;
            return true;
        }
        return false;
    }

    increaseWeapon(){
        this.weaponLevel++;
    }

}

