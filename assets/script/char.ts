import { __private, _decorator, animation, BoxCollider2D, Camera, CCFloat, Collider2D, Component, Contact2DType, IPhysics2DContact, Label, Node, PhysicsGroup, RigidBody2D, Vec2, Vec3 } from 'cc';
import { joystick } from './joystick';
import { GameManager } from './GameManager';
import { SoundEffect } from './SoundEffect';
const { ccclass, property, type } = _decorator;

export enum DirMoving {
    UP = 8,
    DOWN = 2,
    LEFT = 4,
    RIGHT = 6
}

@ccclass('char')
export class char extends Component {
    public static instance: char;
    @property(CCFloat)
    private speed: number = 10;

    public dir: number;
    private anim: animation.AnimationController;

    @property(RigidBody2D)
    public rb: RigidBody2D;

    @property(Node)
    private textPopup: Node;

    @type(PhysicsGroup)
    public rockGroup: PhysicsGroup = PhysicsGroup.DEFAULT;
    @type(PhysicsGroup)
    private itemGr: PhysicsGroup = PhysicsGroup.DEFAULT;

    @property(Camera)
    private camera: Camera;

    public boxCol: BoxCollider2D;
    private dirX: number = 0;
    private dirY: number = 0;
    private leftTimePopup: number = 0;
    private timeSoundPlay: number = 0;
    private isMoving: boolean = false;

    protected onLoad(): void {
        char.instance = this;
    }
    start() {
        this.anim = this.getComponent(animation.AnimationController);
        this.rb = this.getComponent(RigidBody2D);
        this.boxCol = this.getComponent(BoxCollider2D);
        this.boxCol.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        this.boxCol.on(Contact2DType.END_CONTACT, this.onCollisionExit, this);
        joystick.instance.callBackEnd.push(this.onKeyUp.bind(this));
        joystick.instance.callBackHold.push(this.onKeyDown.bind(this));
    }

    update(deltaTime: number) {
        
        this.timeSoundPlay -= deltaTime;

        if (this.isMoving) {
            if ((this.dirX !== 0 || this.dirY !== 0) && this.timeSoundPlay <= 0) {
                this.timeSoundPlay = .2;
                SoundEffect.instance.play(SoundEffect.instance.walk, .5);
            }
        }

        this.leftTimePopup -= deltaTime;

        if (this.leftTimePopup <= 0)
            this.textPopup.active = false;
    }

    protected onDestroy(): void {
        this.boxCol?.off(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        this.boxCol?.off(Contact2DType.END_CONTACT, this.onCollisionExit, this);
    }

    public showPopup(contents: string) {
        this.textPopup.active = true;
        this.textPopup.getComponent(Label).string = contents;
        var label = this.textPopup.getComponent(Label);

        this.textPopup.setWorldPosition(this.node.getWorldPosition().add3f(0, label.lineHeight, 0));
        this.leftTimePopup = 3;
    }

    onKeyDown(event: number) {
        switch (event) {
            case 4:
                this.dir = DirMoving.LEFT;
                this.dirX = -1;
                if (this.node.scale.x > 0)
                    this.node.scale = new Vec3(-this.node.scale.x, this.node.scale.y, this.node.scale.z);
                break;
            case 8:
                this.dir = DirMoving.UP;
                this.dirY = 1;
                break;
            case 2:
                this.dir = DirMoving.DOWN;
                this.dirY = -1;
                break;
            case 6:
                this.dir = DirMoving.RIGHT;
                this.dirX = 1;
                if (this.node.scale.x < 0)
                    this.node.scale = new Vec3(-this.node.scale.x, this.node.scale.y, this.node.scale.z);
                break;
        }
        this.isMoving = true;
        this.rb.linearVelocity = new Vec2(this.speed * this.dirX, this.speed * this.dirY);

        this.anim.setValue("dir", this.dir);

    }

    onKeyUp(event: number) {
        switch (event) {
            case 6:
            case 4:
                this.dirX = 0;
                break;
            case 8:
            case 2:
                this.dirY = 0;
                break;
        }
        if (this.dirX == 0 && this.dirY == 0) {
            this.isMoving = false;
            this.rb.linearVelocity = Vec2.ZERO;

            console.log("top moving");
        }
    }

    onCollisionEnter(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {
        if ((otherCol.group & GameManager.instance.groupTrain) == otherCol.group)
            GameManager.instance.joinTrainBtn.active = true;

        if (otherCol.group == this.itemGr) {
            GameManager.instance.money += 5;
            GameManager.instance.updateText();
            setTimeout(() => otherCol.node.destroy(), 1);
        }
    }

    onCollisionExit(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {
        if ((otherCol.group & GameManager.instance.groupTrain) == otherCol.group)
            GameManager.instance.joinTrainBtn.active = false;
    }
}


