import * as PIXI from 'pixi.js';

export class Bullet extends PIXI.Sprite{
    speed:number;
    constructor(x:number, y:number, texture:PIXI.Texture, speed:number, scale:number){
        super(texture);
        this.position.x = x;
        this.position.y = y;
        this.speed = speed;
        this.scale.x = scale;
        this.scale.y = scale;
    }

    moveLeft(delay:number){
        this.position.x -= delay * this.speed;
    }

    moveRight(delay:number){
        this.position.x += delay* this.speed;
    }

    moveUp(delay:number){
        this.position.y -=  delay*this.speed;
    }

    moveDown(delay:number){
        this.position.y +=  delay*this.speed;
    }
    
}
