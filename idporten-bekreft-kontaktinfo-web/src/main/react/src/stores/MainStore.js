import KontaktinfoStore from "./KontaktinfoStore";
import UIStore from "./UIStore";

export default class MainStore {
    constructor() {
        this.kontaktinfoStore = new KontaktinfoStore(this);
        this.uiStore = new UIStore(this);
    }
}
