import { _decorator, Camera, Collider2D, Component, director, EPhysics2DDrawFlags, find, Game, instantiate, Label, Layout, Node, physics, PhysicsGroup, PhysicsSystem2D, Prefab, Quat, resources, screen, size, Sprite, SpriteFrame, sys, UITransform, Vec2, Vec3, view, Widget } from 'cc';
import { char } from './char';
import { ObjectMap } from './ObjectMap';
import { train } from './train';
import { DirRoad, road } from './road';
import { Tutorial } from './Tutorial';
import { SoundEffect } from './SoundEffect';
const { ccclass, property, type } = _decorator;

@ccclass('GameControl')
export class GameManager extends Component {
    public static instance: GameManager;
    public static rockFrames: SpriteFrame[] = [];
    public static roadGoc: SpriteFrame;
    public static roadDefault: SpriteFrame;

    public wood: number = 0;

    public stone: number = 0;

    public money: number = 0;

    @type(PhysicsGroup)
    public groupTrain: PhysicsGroup = PhysicsGroup.DEFAULT;
    @type(PhysicsGroup)
    public groupRoad: PhysicsGroup= PhysicsGroup.DEFAULT;

    @property(Node)
    public mine: Node;

    @property(Node)
    public build: Node;

    @property(Node)
    public outTrain: Node;

    @property(Node)
    public joinTrainBtn: Node;

    @property(Label)
    public woodtxt: Label;

    @property(Label)
    public stonetxt: Label;

    @property(Label)
    public moneyTxt: Label;

    @property([UITransform])
    private background: UITransform[] = [];

    @property(Prefab)
    public roadPrefab: Prefab;

    private isMine: boolean = false;

    private timeMine: number = 0;

    protected onLoad(): void {
        PhysicsSystem2D.instance.enable = true;
        GameManager.instance = this;
        GameManager.rockFrames = Array<SpriteFrame>(5);
        for (let i = 1; i <= 5; i++) {
            resources.load(`play/rock` + i + `/spriteFrame`, SpriteFrame, (e, d) => {
                if (!e && d != undefined) {
                    GameManager.rockFrames[i - 1] = d;
                }
                else
                    console.log(e);
            })
        }
        if (!GameManager.roadDefault)
            resources.load(`play/road1/spriteFrame`, SpriteFrame, (e, d) => {
                if (e)
                    throw e;
                GameManager.roadDefault = d;
            });

        if (!GameManager.roadGoc)
            resources.load(`play/road2/spriteFrame`, SpriteFrame, (e, d) => {
                if (e)
                    throw e;
                GameManager.roadGoc = d;
            });
        

        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape | EPhysics2DDrawFlags.All;
        
        this.mine.on(Node.EventType.TOUCH_START, this.startMine, this);
        this.mine.on(Node.EventType.TOUCH_END, this.endMine, this);

    }

    start() {

        var ratio = screen.resolution.width / screen.resolution.height;
        var camera = find("Canvas/Camera").getComponent(Camera);
        console.log(camera.orthoHeight * camera.camera.aspect);

        // for (let i = 0; i < this.background.length; i++) {
        //     const e = this.background[i];
        //     var ui = e;
        //     ui.setContentSize(size(camera.orthoHeight * camera.camera.aspect * 2, ui.contentSize.height));
        //     var wg = ui.getComponent(Widget);
        //     wg.left = 0;
        //     wg.right = 0;
        //     wg.bottom = 0;
        //     wg.right = 0;
        // }

        this.updateText();
    }

    update(deltaTime: number) {
        this.timeMine -= deltaTime;
        if (this.isMine && this.timeMine <= 0) {
            let dirX = 0;
            let dirY = 0;
            switch (char.instance.dir) {
                case 4:
                    dirX = -1
                    break;
                case 6:
                    dirX = 1;
                    break;
                case 8:
                    dirY = 1;
                    break;
                case 2:
                    dirY = -1;
                    break;
                default:
                    break;
            }
            const point = new Vec2(char.instance.node.getWorldPosition().x, char.instance.node.getWorldPosition().y);
            point.add2f(80 * dirX, 80 * dirY);
            var result = PhysicsSystem2D.instance.testPoint(point);
            var first = result[0];
            if (first && (first.group & char.instance.rockGroup) == first.group) {
                first.getComponent(ObjectMap).onMine();
            } else if (first && (first.group & this.groupTrain) == first.group) {
                first.getComponent(train).putTrain();
            }
            this.timeMine = .3;
        }
    }

    updateText() {
        this.woodtxt.string = "Wood: " + this.wood;
        this.stonetxt.string = "Stone: " + this.stone;
        this.moneyTxt.string = "Money: " + this.money;
    }

    startMine() {
        this.isMine = true;
        if (Tutorial.instance.step == 2) {
            Tutorial.instance.nextStep();
        }
    }

    endMine() {
        this.isMine = false;
    }


    joinTrain(e: Event) {
        let dirX = 0;
        let dirY = 0;
        switch (char.instance.dir) {
            case 4:
                dirX = -1
                break;
            case 6:
                dirX = 1;
                break;
            case 8:
                dirY = 1;
                break;
            case 2:
                dirY = -1;
                break;
            default:
                break;
        }
        const point = new Vec2(char.instance.node.getWorldPosition().x, char.instance.node.getWorldPosition().y);
        point.add2f(104 * dirX, 104 * dirY);
        var result = PhysicsSystem2D.instance.testPoint(point);
        var first = result[0];
        if (first && (first.group & this.groupTrain) == first.group) {
            first.getComponent(train).putTrain();
        }
    }

    OTrain(e: Event) {
        train.instance.outTrain();
    }

    onBuild(e: Event) {
        var belowChar = this.buildOnDir(0, 0);
        if (belowChar || this.wood < 10 || this.stone < 5) {

            if (belowChar) {
                char.instance.showPopup("Tracks cannot be placed here");
                return;
            }

            if (this.wood < 10 || this.stone < 5) {
                char.instance.showPopup("Requires 10 wood and 5 stones for one rail");
            }
            return;
        }

        let pos = new Vec2(104, 0);//left

        let pre = this.buildOnDir(-1, 0);

        if (!pre) {
            pos = new Vec2(-104, 0);
            pre = this.buildOnDir(1, 0);
        }
        if (!pre) {
            pos = new Vec2(0, -104);
            pre = this.buildOnDir(0, 1);
        }
        if (!pre) {
            pos = new Vec2(0, 104);
            pre = this.buildOnDir(0, -1);
        }
        if (pre) {
            var result = this._build(pre, pos);
            if (!result)
                char.instance.showPopup("Rails can only be placed at a connected location");
            else {
                if (Tutorial.instance.step == 4) {
                    Tutorial.instance.nextStep();
                }
            }
        }
        else
            char.instance.showPopup("Rails can only be placed at a connected location");
    }

    private _build(col: Collider2D, _pos: Vec2): road {

        let pre = col.getComponent(road);
        if (pre.next && pre.pre)
            return;
        this.wood -= 10;
        this.stone -= 5;
        this.updateText();
        var _road = instantiate(this.roadPrefab).getComponent(road);

        var pos = col.node.getWorldPosition();
        pos.add3f(_pos.x, _pos.y, 0);
        _road.node.setWorldPosition(pos);
        _road.offset = pos;
        _road.node.setParent(col.node.parent, true);
        _road.pre = pre.node;
        pre.next = _road.node;
        pre.init(_pos.normalize());
        _road.init(_pos.normalize());


        SoundEffect.instance.play(SoundEffect.instance.build);
        return _road;
    }

    public buildOnDir(dirX: number, dirY: number): Collider2D {
        const point = new Vec2(char.instance.node.getWorldPosition().x, char.instance.node.getWorldPosition().y);
        point.add2f(104 * dirX, 104 * dirY);
        var result = PhysicsSystem2D.instance.testPoint(point);
        if (result) {
            let _result: Collider2D = null;

            for (let j = 0; j < result.length; j++) {
                const e = result[j];
                if ((e.group & this.groupRoad) == e.group) {
                    console.log(e);
                    _result = e;
                }

            }

            return _result;
        }
        return null;
    }

    protected onDestroy(): void {
        this.mine?.off(Node.EventType.TOUCH_START, this.startMine, this);
        this.build?.off(Node.EventType.TOUCH_END, this.endMine, this);
    }
}


