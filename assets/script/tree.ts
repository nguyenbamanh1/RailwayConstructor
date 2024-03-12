import { _decorator, Collider2D, Component, IPhysics2DContact, Node, PhysicsGroup } from 'cc';
import { ObjectMap } from './ObjectMap';
import { GameManager } from './GameManager';
import { Tutorial } from './Tutorial';
import { SoundEffect } from './SoundEffect';
const { ccclass, property, type } = _decorator;

@ccclass('tree')
export class tree extends ObjectMap {

    private step: number;

    @type(PhysicsGroup)
    charGr: PhysicsGroup = PhysicsGroup.DEFAULT;

    public start() {
        super.start();
        this.step = (1 / this.maxNumMine);
    }

    update(deltaTime: number) {

    }

    public onMine(): void {
        super.onMine();
        this.skin.fillRange -= this.step;

        SoundEffect.instance.play(SoundEffect.instance.mine);

        GameManager.instance.wood += 15;
        GameManager.instance.updateText();
    }

    protected onCol(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact): void {
        if((otherCol.group & this.charGr) == otherCol.group){
            if (Tutorial.instance.step == 1) {
                Tutorial.instance.nextStep();
            }
        }
    }
}


