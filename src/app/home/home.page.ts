import { Component } from '@angular/core';
import { MoleHole } from '../../models/button-model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  moleHoles: MoleHole[] = [];
  showHitMessage: Boolean = false;
  gameDriver: any;
  gameTimer: any;
  timeLeft: number = 0;
  timerObserver: any;
  holeObserver: any;
  holeObservable: any;
  score: 0;


  constructor(public router: Router) {

    /**
     * Create an observer to be passed to the new MoleHoles
     */
    this.holeObservable = Observable.create(
      observer => {
        this.holeObserver = observer;
      }
    )
    /**
     * Subscribe to the observer created above to update the score
     */
    this.holeObservable.subscribe(
      () => {
        this.score++;
      }
    )

    for(let i = 0; i<9; i++) {
      this.moleHoles.push(new MoleHole(i, this.holeObserver/*Pass the observer created to the new MoleHoles*/))
    }

    let timerUpdate = Observable.create(observer => {
      this.timerObserver = observer;
    });

    timerUpdate.subscribe(val => {
      this.timeLeft = val;
    })
    this.startGame()
  }



  startGame(){
    const that = this;
    this.score = 0;

    this.gameDriver = setInterval(() => {
      let randomMole = Math.floor(Math.random() * 9);
      this.moleHoles[randomMole].showMole(700);
    }, 800);

    this.timeLeft = 10;

    this.gameTimer = setInterval(() => {
      that.timeLeft = that.timeLeft - 1;
      that.timerObserver.next(that.timeLeft);
      if(that.timeLeft <= 0) {
        clearInterval(that.gameTimer);
        this.stopGame();
        this.saveScore();
      }
    }, 1000)

  }

  stopGame() {
    clearInterval(this.gameDriver);
    clearInterval(this.gameTimer);
    this.timerObserver.next(0);
  }

  saveScore() {
    this.router.navigate(['/leaderboard', this.score])
  }

  resetGame() {
    this.stopGame();
    this.startGame();
  }

  hit(hole: MoleHole) {
    const success = hole.hit();
    if(success) {
      this.showHitMessage = true;
      setTimeout(() => {
        this.showHitMessage = false;
      }, 300);
    }
  }

  stateToClass(state: number) {
    switch(state) {
      /**
       * What should this function do?
       * Hint: Look in the home.scss file
       */
      case 0: return "hid";
      case 1: return "out";
      case 2: return "hit";
    }
}

}
