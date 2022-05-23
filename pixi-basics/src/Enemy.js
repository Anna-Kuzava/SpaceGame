import * as PIXI from 'pixi.js';

export class Enemy extends PIXI.Sprite{
    constructor(x, y, texture){
        super(texture);
        this.position.x = x;
        this.position.y = y;
        this.speed = 2;
    }

    moveLeft(delay){
        this.position.x -= delay * this.speed;
    }

    moveRight(delay){
        this.position.x += delay* this.speed;
    }

    moveUp(delay){
        this.position.y -=  delay*this.speed;
    }

    moveDown(delay){
        this.position.y +=  delay*this.speed;
    }
}

export class BossEnemy extends Enemy{
    constructor(x, y, texture, health = 10){
        super(x, y, texture);
        this.speed = 2;
        this.health = health;
        this.shootingSpeed = 700;
        this.lastShot = Date.now();
        this.width = 200;
        this.height = 150;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.angle = 180;
    }
    moveLeft(delay){
        this.position.x -= delay * this.speed;
    }

    moveRight(delay){
        this.position.x += delay* this.speed;
    }

    moveUp(delay){
        this.position.y -=  delay*this.speed;
    }

    moveDown(delay){
        this.position.y +=  delay*this.speed;
    }
    
    takeHit(){
       this.health--;
    }

    canShoot(){
        if(this.health > 0){
        let currentTime = Date.now();
            if(currentTime - this.lastShot > this.shootingSpeed){
                this.lastShot = currentTime;
                return true;
            }
        }
        return false;
    }

}
