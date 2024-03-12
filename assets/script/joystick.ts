import { _decorator, Camera, CCFloat, Component, EventKeyboard, EventMouse, EventTouch, Input, KeyCode, math, Node, sys, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('joystick')
export class joystick extends Component {

    public static instance: joystick;

    @property(Node)
    public up: Node;


    @property(Node)
    private left: Node;

    @property(Node)
    private right: Node;


    @property(Node)
    public down: Node;

    public callBackHold: Function[] = [];
    public callBackEnd: Function[] = [];

    protected onLoad(): void {
        joystick.instance = this;
        this.up.on(Node.EventType.TOUCH_START, e => this.onTouchHold(8), this);
        this.up.on(Node.EventType.TOUCH_END, e => this.onTouchEnd(8), this);

        this.left.on(Node.EventType.TOUCH_START, e => this.onTouchHold(4), this);
        this.left.on(Node.EventType.TOUCH_END, e => this.onTouchEnd(4), this);

        this.right.on(Node.EventType.TOUCH_START, e => this.onTouchHold(6), this);
        this.right.on(Node.EventType.TOUCH_END, e => this.onTouchEnd(6), this);

        this.down.on(Node.EventType.TOUCH_START, e => this.onTouchHold(2), this);
        this.down.on(Node.EventType.TOUCH_END, e => this.onTouchEnd(2), this);

        // if (sys.os == sys.OS.WINDOWS) {
        //     systemEvent.on(Input.EventType.KEY_DOWN, (e: EventKeyboard) => {
        //         let dir = 0;
        //         switch (e.keyCode) {
        //             case KeyCode.KEY_A:
        //                 dir = 4;
        //                 break;
        //             case KeyCode.KEY_W:
        //                 dir = 8
        //                 break;
        //             case KeyCode.KEY_S:
        //                 dir = 2;
        //                 break;
        //             case KeyCode.KEY_D:
        //                 dir = 6;
        //                 break;
        //         }
        //         this.onTouchHold(dir);
        //     }, this);

        //     systemEvent.on(Input.EventType.KEY_UP, (e: EventKeyboard) => {
        //         let dir = 0;
        //         switch (e.keyCode) {
        //             case KeyCode.KEY_A:
        //                 dir = 4;
        //                 break;
        //             case KeyCode.KEY_W:
        //                 dir = 8
        //                 break;
        //             case KeyCode.KEY_S:
        //                 dir = 2;
        //                 break;
        //             case KeyCode.KEY_D:
        //                 dir = 6;
        //                 break;
        //         }
        //         this.onTouchEnd(dir);
        //     }, this);
        // }

    }

    protected onDestroy(): void {
        // if (this.up) {

        //     this.up?.off(Node.EventType.TOUCH_START, e => this.onTouchHold(8), this);
        //     this.up?.off(Node.EventType.TOUCH_END, e => this.onTouchEnd(8), this);
        // }

        // if (this.left) {
        //     this.left?.off(Node.EventType.TOUCH_START, e => this.onTouchHold(4), this);
        //     this.left?.off(Node.EventType.TOUCH_END, e => this.onTouchEnd(4), this);
        // }

        // if (this.right) {

        //     this.right?.off(Node.EventType.TOUCH_START, e => this.onTouchHold(6), this);
        //     this.right?.off(Node.EventType.TOUCH_END, e => this.onTouchEnd(6), this);
        // }

        // if (this.down) {

        //     this.down?.off(Node.EventType.TOUCH_START, e => this.onTouchHold(2), this);
        //     this.down?.off(Node.EventType.TOUCH_END, e => this.onTouchEnd(2), this);
        // }

        // this.callBackEnd = [];
        // this.callBackHold = [];
    }


    onTouchHold(dir: number) {
        this.callBackHold.forEach(callBack => callBack(dir));
    }

    onTouchEnd(dir: number) {
        this.callBackEnd.forEach(callBack => callBack(dir));
    }
}


