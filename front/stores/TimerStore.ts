import { action, makeAutoObservable, makeObservable, observable } from 'mobx';

export class TimerStore {
  minutes: string = '??';
  seconds: string = '??'

  constructor() {
    makeAutoObservable(this);
  }

  setTimer = ({minutes, seconds}: {minutes: string, seconds: string}) => {
    this.minutes = minutes;
    this.seconds = seconds;
  }

}