import { _decorator, BoxCollider2D, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Sprite } from 'cc';
import { SoundEffect } from './SoundEffect';
const { ccclass, property } = _decorator;

@ccclass('ObjectMap')
export class ObjectMap extends Component {

    @property(CCInteger)
    protected maxNumMine: number;
    protected skin: Sprite;

    protected col: BoxCollider2D;

    start() {
        this.skin = this.getComponent(Sprite);
        this.col = this.getComponent(BoxCollider2D);
        this.col.on(Contact2DType.BEGIN_CONTACT, this.onCol, this);
        
        this.col.on(Contact2DType.END_CONTACT, this.endCol, this);
    }

    public onMine() {
        this.maxNumMine--;
        
        if (this.maxNumMine <= 0)
            this.node.destroy();
    }



    protected onCol(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {

    }

    protected endCol(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {
        
    }
}


