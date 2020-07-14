import KontaktinfoStore from "./KontaktinfoStore";

export default class MainStore {
    constructor() {
        this.kontaktinfoStore = new KontaktinfoStore(this);
    }
}
