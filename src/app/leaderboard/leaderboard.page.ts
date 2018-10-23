import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { DataService } from '../data.service';



@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage {

  score: number;
  scoreList: any[] = [];

  constructor(public router: Router, 
    private route: ActivatedRoute, 
    public dataService: DataService, 
    public storage: Storage,
    public platform: Platform) {

    
    let temp: number;

    this.route.params.subscribe(data => {
      temp = data["score"]; //get data from activated routing
    });
    this.score = temp === undefined ? 0 : temp;
    console.log("score is " + this.score);

  }


  ngAfterViewInit() {
    console.log('ngAfterViewInit LeaderboardPage');

    /*Storage get*/this.storage.get('leaderboard').then((result) => {
      let res;
      if(!result) {
        res = []
      } else {
        res = JSON.parse(result)
      }

      res.push({
        score: this.score,
        time: Date.now()
      })

      console.log(res);

      this.scoreList = res.sort(function(a, b) {
        if(a.score > b.score) {
          return -1;
        } else {
          return 1;
        }
      })

      /*Storage set*/this.storage.set('leaderboard', JSON.stringify(res));
    })
  }

}

