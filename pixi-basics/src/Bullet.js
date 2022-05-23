import * as PIXI from 'pixi.js';

export class Bullet extends PIXI.Sprite{
    constructor(x, y, texture, speed, scale){
        super(texture);
        this.position.x = x;
        this.position.y = y;
        this.speed = speed;
        this.scale.x = scale;
        this.scale.y = scale;
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
