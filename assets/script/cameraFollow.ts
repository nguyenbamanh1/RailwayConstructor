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
        this.offset = this.node.getPosition().subtract(this.player.getPosition());
    }

    update(deltaTime: number) {
        if (this.player) {
            let target = new Vec3(this.player.getPosition().x + this.offset.x, this.player.getPosition().y + this.offset.y, this.node.getPosition().z);

            this.node.setPosition(target);
            this.UI.forEach(e => {
                e.setPosition(new Vec3(target.x, target.y, e.getPosition().z));
            });
        } else {
            this.player = char.instance.node;
        }
    }

    public setFocus(n: Node) {
        this.player = n;
    }
}


