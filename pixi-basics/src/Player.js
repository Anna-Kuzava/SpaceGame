import * as PIXI from 'pixi.js';

export class Player extends PIXI.Sprite{
    constructor(x, y, texture){
        super(texture);
        this.position.x = x;
        this.position.y = y;
        this.health = 3;
        this.speed = 5;
        this.shootingSpeed = 200;
        this.lastShot = Date.now();
    }

    looseLife(){
        this.health--;
    }

    gainLife(){
        this.health++;
    }

    moveLeft(delay){
        this.position.x -= delay * this.speed;
        if(this.position.x < 0){
            this.position.x = 0;
        }
    }

    moveRight(delay, canvasWidth){
        this.position.x += delay * this.speed;
        if(this.position.x > canvasWidth - 30){
            this.position.x = canvasWidth - 30;
        }
    }

    moveUp(delay){
        this.position.y -= delay * this.speed; 
        if(this.position.y < 0){
            this.position.y = 0;
        }
    }

    moveDown(delay, canvasHeight){
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
    
    canShoot(){
        let currentTime = Date.now();
        if(currentTime - this.lastShot > this.shootingSpeed){
            this.lastShot = currentTime;
            return true;
        }
        return false;
    }

}

