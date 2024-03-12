import { _decorator, BoxCollider2D, CCInteger, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, PhysicsGroup, Prefab } from 'cc';
import { task } from './task';
import { Item } from './Item';
const { ccclass, property, type } = _decorator;

export enum STATION {
    PARI = 1,
    TOKYO = 2,
    BERLINE = 3,
    HANOI = 4
}

@ccclass('station')
export class station extends Component {

    @type(CCInteger)
    private stationType: STATION = STATION.PARI;

    @type(PhysicsGroup)
    private trainGroup: PhysicsGroup = PhysicsGroup.DEFAULT;

    @property(BoxCollider2D)
    private boxCheck: BoxCollider2D;

    @property([Node])
    private pointSpawn: Node[] = [];

    @property(Prefab)
    private goldPrefab: Prefab;

    private inside: boolean = false;

    @property([Item])
    public coins: Item[] = [];

    start() {
        this.boxCheck.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        this.boxCheck.on(Contact2DType.END_CONTACT, this.onCollisionExit, this);
    }

    protected onDestroy(): void {
        this.boxCheck?.off(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        this.boxCheck?.off(Contact2DType.END_CONTACT, this.onCollisionExit, this);
    }

    update(deltaTime: number) {

    }

    onCollisionEnter(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {

        if ((otherCol.group & this.trainGroup) == otherCol.group && !this.inside) {
            console.log("inside")
            this.inside = true;
            this.checkTask();
            setTimeout(() => {
                if (this.coins.length <= 0) {
                    for (let i = 0; i < this.pointSpawn.length; i++) {
                        const e = this.pointSpawn[i];
                        var g = instantiate(this.goldPrefab);
                        if (g) {
                            g.setWorldPosition(e.getWorldPosition().add3f(0, 10, 0));
                            g.setParent(this.node, true);
                            var it = g.getComponent(Item);
                            it.___parent = this;
                            this.coins.push(it);
                        }
                    }
                }

            }, 1);
        }
    }

    onCollisionExit(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {
        if ((otherCol.group & this.trainGroup) == otherCol.group && this.inside) {
            this.inside = false;
            console.log("out side");
        }
    }

    checkTask() {
        if (this.stationType == task.instance.taskValues[task.instance.taskIndex]) {
            task.instance.nextTask();
        }
    }

}


