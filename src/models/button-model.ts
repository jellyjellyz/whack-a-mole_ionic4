import { NativeAudio } from '@ionic-native/native-audio/ngx';

export class MoleHole {
    //moleState
    //0: hid
    //1: out
    //2: hit

    moleState: Number
    holeNumber: Number
    private nativeAudio: NativeAudio = new NativeAudio();

    constructor(public num: Number, public observer: any) {
        this.moleState = 0;
        this.holeNumber = num;

        this.nativeAudio.preloadSimple('squish', '../assets/squish.mp3').then(
            () => {
                console.log("successfully load mp3");
            }, 
            (err) => {
                console.log(err);
            });
    }

    showMole(duration) {
        // If the mole is already out, 
        // console.log(`NO.${this.holeNumber} hole, before state: ${this.moleState}`);
        if(this.moleState === 0) {
            this.moleState = 1;
            // console.log(`NO.${this.holeNumber} hole, after state: ${this.moleState}`);
            let that = this;
            setTimeout(function(){
                that.hideMole();
            }, duration);
        }   else {
            return false;
        }
    }

    hit() {
        if(this.moleState === 1) {
            this.moleState = 2;
            console.log("hit ", this.moleState);
            this.observer.next(true);
            this.nativeAudio.play('squish');
            let that = this;
            setTimeout(function(){
                that.moleState = 0
            }, 1000)
            return true;
        }   else    {
            return false;
        }
    }

    hideMole() {
        if(this.moleState === 1) {
            this.moleState = 0;
        }
    }

    isOut() {
        return this.moleState;
    }

}