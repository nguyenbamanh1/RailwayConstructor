import { _decorator, Color, Component, director, native, Node, Sprite, sys } from 'cc';
import { SoundEffect } from './SoundEffect';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {

    @property(Sprite)
    blend: Sprite;

    play() {
        if (this.blend.node.active)
            return;
        this.blend.node.active = true;
        SoundEffect.instance.play(SoundEffect.instance.startGame);
        setTimeout(() => {

            director.loadScene("play", (e, a) => {
                if (e)
                    throw e;
            })
        }, 1000);
    }



    exit() {
        if (sys.isNative && (sys.os == sys.OS.ANDROID)) {
            native.reflection.callStaticMethod("com/cocos/game/AppActivity", "exit", "()V");
        }
    }
}


