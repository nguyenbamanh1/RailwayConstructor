import { _decorator, Component, Node, Scene, Vec2, Vec3 } from 'cc';
import { char } from './char';
const { ccclass, property, type } = _decorator;

@ccclass('cameraFollow')
export class cameraFollow extends Component {

    public static instance: cameraFollow;

    private player: Node;

    @property([Node])
    private UI: Node[] = [];

    private offset: Vec3;
    
    protected onLoad(): void {
        cameraFollow.instance = this;
    }

    start() {
        this.player = char.instance.node;
        this.offset = this.node.getWorldPosition().subtract(this.player.getWorldPosition());
    }

    lateUpdate(deltaTime: number) {
        if (this.player) {
            const vec3 = new Vec3(this.player.getWorldPosition().x + this.offset.x, this.player.getWorldPosition().y + this.offset.y, this.node.getWorldPosition().z);
            this.node.setWorldPosition(vec3);
            this.UI.forEach(e => {
                e.setWorldPosition(vec3);
            });
        } else {
            this.player = char.instance.node;
        }
    }

    public setFocus(n: Node) {
        this.player = n;
    }
}


