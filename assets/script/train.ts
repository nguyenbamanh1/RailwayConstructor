import { _decorator, CCFloat, Collider2D, Component, ERigidBody2DType, Game, Node, PhysicsSystem2D, Quat, RigidBody2D, Root, sp, Vec2, Vec3 } from 'cc';
import { char, DirMoving } from './char';
import { joystick } from './joystick';
import { GameManager } from './GameManager';
import { cameraFollow } from './cameraFollow';
import { DirRoad, road } from './road';
const { ccclass, property } = _decorator;

@ccclass('train')
export class train extends Component {
    public static instance: train;

    private onTrain: boolean;

    private rb: RigidBody2D;

    @property(CCFloat)
    private speed: number;

    @property(CCFloat)
    private maxSpeed: number;

    private isMoving: boolean;

    private currSpeed: number;

    @property(road)
    private roadTarget: road;

    private dir: number;



    protected onLoad(): void {
        train.instance = this;
    }

    start() {
        this.rb = this.getComponent(RigidBody2D);
        joystick.instance.callBackEnd.push(this.onKeyUp.bind(this));
        joystick.instance.callBackHold.push(this.onKeyDown.bind(this));
        this.currSpeed = this.speed;

        var _road = this.checkRoad(0, 0);
        if (_road) {
            this.roadTarget = _road.getComponent(road);
            this.node.setWorldPosition(this.roadTarget.node.getWorldPosition());
        }
    }

    private checkRoad(dirX: number, dirY: number): Collider2D {
        const point = new Vec2(this.node.getWorldPosition().x, this.node.getWorldPosition().y);
        point.add2f(dirX, dirY);
        var result = PhysicsSystem2D.instance.testPoint(point);
        if (result) {
            let _result: Collider2D = null;
            for (let i = 0; i < result.length; i++) {
                const e = result[i];
                if (e && GameManager.instance.groupRoad == e.group) {
                    _result = e;
                }
            }
            return _result;
        }
        return null;
    }

    update(deltaTime: number) {
        if (this.isMoving) {
            if (this.currSpeed < this.maxSpeed)
                this.currSpeed += 5;

            if (this.currSpeed > this.maxSpeed)
                this.currSpeed = this.maxSpeed;

            var _isRoad = this.checkRoad(156 * this.dir, 0);

            if (this.roadTarget) {

                var _distance = Vec2.distance(this.roadTarget.node.getWorldPosition(), this.node.getWorldPosition());
                if (_distance > 10) {

                    var thisPos = this.node.getWorldPosition().clone();

                    var distance = this.roadTarget.node.getWorldPosition().subtract(thisPos).normalize();

                    this.rb.linearVelocity = new Vec2(distance.x * this.speed, distance.y * this.speed);

                } else {

                    this.roadTarget = ( this.dir == -1 ? this.roadTarget.pre : this.roadTarget.next).getComponent(road);
                    if (this.roadTarget) {

                        var angle = 0;

                        if (this.roadTarget.isDir(DirRoad.VERTICAL))
                            angle = -90;
                        else if (this.roadTarget.isDir(DirRoad.HORIZONTAL))
                            angle = 0;

                        this.node.setWorldRotation(Quat.fromAngleZ(this.node.worldRotation, angle));
                    }
                }
            } else {

                console.log("end road");

                this.rb.linearVelocity = Vec2.ZERO;
            }

        }
    }

    onKeyDown(event: number) {
        switch (event) {
            case DirMoving.LEFT:
                this.dir = -1;
                break;
            case DirMoving.RIGHT:
                this.dir = 1;
                break;
        }

        if (this.onTrain) {
            this.isMoving = true;
            var _road = this.checkRoad(0, 0);
            if (_road) {
                this.roadTarget = _road.getComponent(road);
                this.node.setWorldPosition(this.roadTarget.node.getWorldPosition());
            }
        }
    }

    onKeyUp(event: number) {
        this.dir = 0;
        this.rb.linearVelocity = Vec2.ZERO;
        this.isMoving = false;
        this.currSpeed = this.speed;
    }


    public putTrain() {
        console.log("on train");
        this.onTrain = true;
        char.instance.node.active = false;
        //this.rb.type = ERigidBody2DType.Dynamic;
        joystick.instance.up.active = false;
        joystick.instance.down.active = false;
        GameManager.instance.build.active = false;
        GameManager.instance.mine.active = false;
        GameManager.instance.outTrain.active = true;
        cameraFollow.instance.setFocus(this.node);
    }

    public outTrain() {
        joystick.instance.up.active = true;
        joystick.instance.down.active = true;
        GameManager.instance.build.active = true;
        GameManager.instance.mine.active = true;
        GameManager.instance.outTrain.active = false;
        this.onTrain = false;
        //this.rb.type = ERigidBody2DType.Kinematic;
        char.instance.node.active = true;
        char.instance.node.setPosition(new Vec3(this.node.getPosition().x, this.node.getPosition().y - 150));
        cameraFollow.instance.setFocus(char.instance.node);
    }
}


