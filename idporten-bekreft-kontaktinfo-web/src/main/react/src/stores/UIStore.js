import {action, observable} from "mobx";


export default class UIStore {
    @observable loadingCount = 0;

    constructor(mainStore) {
        this.mainStore = mainStore;
    }


    @action.bound
    handleError(error) {
        this.mainStore.errorHandler.handleError(error);
    }


}
