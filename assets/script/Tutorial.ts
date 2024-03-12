import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tutorial')
export class Tutorial extends Component {

    public static instance: Tutorial;

    public static tutorial: boolean = true;


    public step: number = 0;

    @property([Node])
    protected steps: Node[] = [];
    private currStep: Node;

    protected onLoad(): void {
        Tutorial.instance = this;
        if (!sys.localStorage.getItem("tutorial"))
            Tutorial.tutorial = false;
    }

    protected start(): void {
        this.steps.forEach(e => e.active = false);
        this.nextStep();
    }

    public nextStep() {
        if (this.currStep)
            this.currStep.active = false;
        
        if (this.step >= this.steps.length) {
            sys.localStorage.setItem("tutorial", "true");
            Tutorial.tutorial = false;
            return;
        }
        

        this.steps[this.step].active = true;
        this.currStep = this.steps[this.step];

        this.step += 1;
    }

}


