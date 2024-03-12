import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundEffect')
export class SoundEffect extends Component {

    public static instance: SoundEffect;

    public static isMusic: boolean = true;

    @property(AudioClip)
    public build: AudioClip;

    @property(AudioClip)
    public startGame : AudioClip;

    @property(AudioClip)
    public mine : AudioClip;

    @property(AudioClip)
    public mineStone : AudioClip;

    @property(AudioClip)
    public stoneDestroy : AudioClip;


    @property(AudioClip)
    public click : AudioClip;

    @property(AudioClip)
    public walk : AudioClip;

    private audioSource: AudioSource;

    protected onLoad(): void {
        SoundEffect.instance = this;
    }

    protected start(): void {
        this.audioSource = this.addComponent(AudioSource);
    }



    public play(clip: AudioClip, volume : number = 1) {
        if (!SoundEffect.isMusic)
            return;

        this.audioSource.clip = clip;
        this.audioSource.loop = false;
        this.audioSource.volume = volume;
        this.audioSource.play();
    }

    public stop(){
        this.audioSource.stop();
    }
}


