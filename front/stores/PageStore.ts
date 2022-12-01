import { action, makeAutoObservable, makeObservable, observable } from 'mobx';

export class PageStore {
  page = '';

  constructor() {
    makeObservable(this, {
      page: observable,
      setPage: action,
    });
  }

  setPage = (newPage: string) => {
    this.page = newPage;
  }
}