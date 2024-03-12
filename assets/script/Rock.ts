import { _decorator, Component, Node } from 'cc';
import { ObjectMap } from './ObjectMap';
import { SoundEffect } from './SoundEffect';
import { GameManager } from './GameManager';
import { Tutorial } from './Tutorial';
const { ccclass, property } = _decorator;

@ccclass('Rock')
export class Rock extends ObjectMap {

    
    public onMine(){
        
        SoundEffect.instance.play(SoundEffect.instance.mineStone);

        super.onMine();

        this.skin.spriteFrame = GameManager.rockFrames[5 - this.maxNumMine];
        
        if(this.maxNumMine <= 0){
            if (Tutorial.instance.step == 3) {
                Tutorial.instance.nextStep();
            }
            SoundEffect.instance.play(SoundEffect.instance.stoneDestroy);

        }
        GameManager.instance.stone += 10;
        GameManager.instance.updateText();
    }
}


