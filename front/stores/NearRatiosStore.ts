import { action, makeAutoObservable, makeObservable, observable } from 'mobx';

export class RatioStore {
  ratioUSD: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setRatio = (newRatio: number) => {
    this.ratioUSD = newRatio;
  }

  fetchRatio = async() => {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=NEAR&tsyms=USD');
    const ratios = await response.json();
    if (ratios) {
      // console.log(ratios);
      this.setRatio(Number(ratios.USD));
    }
    else throw Error("Cannot get NEAR price ratio!");
  }
}