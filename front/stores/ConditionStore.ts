import { action, makeAutoObservable, makeObservable, observable } from 'mobx';

export class ConditionStore {
  availableToBuyTicket: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setAvailableToBuyTicket = (available: boolean) => {
    this.availableToBuyTicket = available;
  }
}