import { _decorator, BoxCollider2D, CCInteger, Collider2D, Component, Contact2DType, IPhysics2DContact, Label, Node, PhysicsGroup, PhysicsSystem, PhysicsSystem2D, size, Size, Sprite, UITransform, Vec2 } from 'cc';
import { controlUI } from './controlUI';
const { ccclass, property, type } = _decorator;

@ccclass('area')
export class area extends Component {

    public static currentArea: area;

    @property(CCInteger)
    public money: number;

    @type(PhysicsGroup)
    charGr: PhysicsGroup = PhysicsGroup.DEFAULT;

    col: BoxCollider2D;



    protected start(): void {
        var uiCanvas = this.getComponent(UITransform);
        this.col = this.getComponent(BoxCollider2D);
        this.col.offset = new Vec2(0, 0);
        this.col.size = size(uiCanvas.width, uiCanvas.height);
        this.col.on(Contact2DType.BEGIN_CONTACT, this.onTouch, this);
        this.col.on(Contact2DType.END_CONTACT, this.endTouch, this);
    }

    protected onDestroy(): void {
        area.currentArea = undefined;
    }

    onTouch(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {
        if ((otherCol.group & this.charGr) == otherCol.group) {
            controlUI.instance.shopUI.active = true;
            controlUI.instance.shopUI.getComponentInChildren(Label).string = this.money.toString();
            area.currentArea = this;
        }
    }

    endTouch(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {
        if ((otherCol.group & this.charGr) == otherCol.group) {
            controlUI.instance.shopUI.active = false;
            area.currentArea = undefined;
        }
    }
}


