import * as PIXI from 'pixi.js';

export class TextField extends PIXI.Text{
    constructor(text:string, style:PIXI.TextStyle, x:number, y:number){
        super(text, style)
        this.position.x = x;
        this.position.y = y;
        this.scale.x = 2;
    }
    setText(text:string){
        this.text = text;
    }

}

