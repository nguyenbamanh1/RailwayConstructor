import { _decorator, CCInteger, CCString, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('task')
export class task extends Component {
    public static instance: task;

    @property([CCString])
    private taskContents: string[] = [];

    @property([CCInteger])
    public taskValues : number[] = [];

    public taskIndex: number = 0;

    label: Label;

    protected onLoad(): void {
        task.instance = this;
    }

    start() {
        this.label = this.getComponent(Label);
        this.initTask();
    }

    public initTask() {
        this.label.string = "TASK: " + this.taskContents[this.taskIndex];
    }

    public nextTask() {
        this.taskIndex++;
        this.initTask();
    }
}


