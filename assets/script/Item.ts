import { _decorator, Component, Node } from 'cc';
import { station } from './station';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {

    public ___parent : station;

    start() {

    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.___parent.coins[this.___parent.coins.lastIndexOf(this)] = null;
        this.___parent.coins.sort();
        this.___parent.coins.pop();
    }
}


