import { _decorator, BoxCollider2D, Collider2D, Component, Node, PhysicsSystem2D, Quat, Sprite, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property, type } = _decorator;


export enum DirRoad {
    HORIZONTAL,
    VERTICAL,
    TOP_LEFT,
    TOP_RIGHT,
    BOT_LEFT,
    BOT_RIGHT
}

@ccclass('road')
export class road extends Component {

    public dir: DirRoad = DirRoad.HORIZONTAL;

    @property(Node)
    public pre: Node;

    @property(Node)
    public next: Node;

    @property(BoxCollider2D)
    private col: BoxCollider2D;

    public offset: Vec3 = new Vec3(0, 0, 0);

    protected start(): void {
        if (!this.next) {
            this.next = this.checkDir(1, 0)?.node;
            if (this.next)
                this.next.getComponent(road).pre = this.node;
            console.log(this.next?.name + "/" + this.pre?.name);
        }
        if (this.pre)
            this.pre.getComponent(road).next = this.node;
    }

    public setDir(dir: DirRoad) {
        this.dir = dir;
    }

    public isDir(dir: DirRoad): boolean {
        return this.dir == dir;
    }

    public init(dir: Vec2) {
        const left = this.checkDir(-1, 0);
        const right = this.checkDir(1, 0);
        const top = this.checkDir(0, 1);
        const down = this.checkDir(0, -1);
        var pos = this.pre ? new Vec3(this.offset.x, this.offset.y, this.offset.z) : new Vec3();
        if ((top && left) || (top && right) || (left && down) || (right && down)) {
            this.getComponent(Sprite).spriteFrame = GameManager.roadGoc;
            if (top && left) {
                pos.add3f(6.5 * dir.x, 6.5 * dir.y, 0);
                this.node.setWorldPosition(pos);
                this.setDir(DirRoad.TOP_LEFT);
                this.node.setRotation(Quat.fromAngleZ(this.node.rotation, 0));

            } else if ((top && right)) {
                this.node.setRotation(Quat.fromAngleZ(this.node.rotation, -90));
                pos.add3f(6.5 * dir.x, 6.5 * dir.y, 0);
                this.node.setWorldPosition(pos);
                this.setDir(DirRoad.TOP_RIGHT);
            }
            else if (left && down) {
                this.node.setRotation(Quat.fromAngleZ(this.node.rotation, 90));
                pos.add3f(6.5 * dir.x, 6.5 * dir.y, 0);
                this.node.setWorldPosition(pos);
                this.setDir(DirRoad.BOT_LEFT);
            }
            else if (right && down) {
                this.node.setRotation(Quat.fromAngleZ(this.node.rotation, 180));

                pos.add3f(6.5 * dir.x, 6.5 * dir.y, 0);
                this.node.setWorldPosition(pos);
                this.setDir(DirRoad.BOT_RIGHT);
            }
            return;
        }

        if (top || down) {
            if (this.isDir(DirRoad.HORIZONTAL)) {
                this.setDir(DirRoad.VERTICAL);
                this.node.setRotation(Quat.fromAngleZ(this.node.rotation, 90));
            }
        }

        if (this.pre) {
            pos = new Vec3(this.offset.x, this.offset.y, this.offset.z);
            var _road = this.pre.getComponent(road);
            if (_road.isDir(DirRoad.BOT_LEFT)) {
                if (dir.x < 0)
                    dir.y = .5;
                else if (dir.y < 0)
                    dir.x = .5;

                pos.add3f(13 * dir.x, 13 * dir.y, 0);

                this.node.setWorldPosition(pos);
            } else if (_road.isDir(DirRoad.BOT_RIGHT)) {

                if (dir.y < 0)
                    dir.x = -.5;
                if (dir.x > 0)
                    dir.y = .5;
                pos.add3f(13 * dir.x, 13 * dir.y, 0);
                this.node.setWorldPosition(pos);

            } else if (_road.isDir(DirRoad.TOP_RIGHT)) {

                if (dir.x > 0)
                    dir.y = -.5;
                else if (dir.y > 0)
                    dir.x = -.5;
                pos.add3f(13 * dir.x, 13 * dir.y, 0);
                this.node.setWorldPosition(pos);

            } else if (_road.isDir(DirRoad.TOP_LEFT)) {

                if (dir.y > 0)
                    dir.x = .5;
                else if (dir.x < 0)
                    dir.y = -.5

                pos.add3f(13 * dir.x, 13 * dir.y, 0);
                this.node.setWorldPosition(pos);
            }
        }

    }

    private checkDir(dirX: number, dirY: number): Collider2D {
        const point = new Vec2(this.node.getWorldPosition().x, this.node.getWorldPosition().y);
        point.add2f(104 * dirX, 104 * dirY);
        var result = PhysicsSystem2D.instance.testPoint(point);
        if (result) {
            let _result: Collider2D = null;
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                const e = result[i];
                if (e && this.col.group == e.group) {
                    _result = e;
                }
            }

            return _result;
        }
        return null;
    }
}


