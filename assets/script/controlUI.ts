import { _decorator, Canvas, Component, director, Node } from 'cc';
import { area } from './area';
import { char } from './char';
import { GameManager } from './GameManager';
import { SoundEffect } from './SoundEffect';
const { ccclass, property } = _decorator;

@ccclass('controlUI')
export class controlUI extends Component {
    public static instance: controlUI;
    @property(Node)
    private mutebtn: Node;
    @property(Node)
    private musicbtn: Node;

    @property(Node)
    private otherUI: Node;

    @property(Node)
    public shopUI: Node;

    protected onLoad(): void {
        controlUI.instance = this;
    }

    protected start(): void {

    }

    music(e: Event) {
        director.resume();
        SoundEffect.isMusic = false;
        SoundEffect.instance.play(SoundEffect.instance.click)
        this.musicbtn.active = false;
        this.mutebtn.active = true;
        director.pause();
    }

    mute(e: Event) {
        director.resume();
        SoundEffect.instance.play(SoundEffect.instance.click)
        SoundEffect.isMusic = true;
        this.musicbtn.active = true;
        this.mutebtn.active = false;
        director.pause();
    }

    gamePause(e: Event) {
        SoundEffect.instance.play(SoundEffect.instance.click)
        this.otherUI.active = true;
        director.pause();
    }

    gameResume(e: Event) {
        SoundEffect.instance.play(SoundEffect.instance.click)
        this.otherUI.active = false;
        director.resume();
    }

    retry(e: Event) {
        SoundEffect.instance.play(SoundEffect.instance.click)
        director.resume();
        director.loadScene("play", (e, scene) => {
            if (e)
                throw e;

        });
    }

    home(E: Event) {
        SoundEffect.instance.play(SoundEffect.instance.click)
        director.resume();
        director.loadScene("Home", (e, scene) => {
            if (e)
                throw e;
        });
    }

    buyArea() {
        SoundEffect.instance.play(SoundEffect.instance.click)
        if (area.currentArea) {
            if (GameManager.instance.money >= area.currentArea.money) {
                
                GameManager.instance.money -= area.currentArea.money;
                GameManager.instance.updateText();
                area.currentArea.node.destroy();
            } else {
                char.instance.showPopup("Not enough money. You are missing " + (area.currentArea.money - GameManager.instance.money) + " gold coins")
            }
        }
    }


}


