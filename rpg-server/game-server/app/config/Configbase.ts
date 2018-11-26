import ConfigLoader from "./ConfigLoader";

export class ConfigBase {
    protected _name: string;
    protected _obj: object;
    protected _bInit: boolean;
    constructor(name_: string) {
        this._name = name_;
    }

    protected init() {
        if (this._bInit) return;
        this._bInit = true;
        this._obj = ConfigLoader.instance.getConfig(this._name);
    }
}
