import * as PIXI from 'pixi.js';

export class TextField extends PIXI.Text{
    constructor(text, style, x, y){
        super(text, style)
        this.position.x = x;
        this.position.y = y;
        this.scale.x = 2;
    }
    setText(text){
        this.text = text;
    }

}

