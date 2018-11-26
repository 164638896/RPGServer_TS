
const START_LINE: number = 0;
const DSCP_LINE: number = 1;
const FIELD_LINE: number = 2;
const TYPE_LINE: number = FIELD_LINE + 1;
const DATA_LINE: number = FIELD_LINE + 2;

export class ILoader {
    load(caller: any, complete?: Function, progress?: Function) {}
    getOriginalData(name: string) {}
    protected onComplete() {}
    protected onProgreess() {}
}

/**
 * 读取配置类
 */
export default class ConfigLoader {
    private mLoader: ILoader;

    private static _instance: ConfigLoader;
    static get instance() {
        return ConfigLoader._instance || (ConfigLoader._instance = new ConfigLoader());
    }

    private original_data = {};
    private configs = {};
    private getOriginalConfig(name: string): any {
        if (this.original_data[name]) {
            return this.original_data[name];
        }

        let arr = this.mLoader.getOriginalData(name);
        let arrKeys = arr[START_LINE];
        if (arrKeys.length == 0) {
            //结构表，存储备用
            this.original_data[name] = arr;
        }
        return arr;
    }

    public loadAllConfig(loader: ILoader = null, caller: any = null, complete?: Function, progress?: Function) {
        if(loader != null) {
            this.mLoader = loader;
        }
        this.mLoader.load(caller, complete, progress);
    }

    public getConfig(name: string): any {
        if (this.configs[name]) {
            return this.configs[name];
        }

        let retObj = {};
        let arr = this.getOriginalConfig(name);
        let fields = arr[FIELD_LINE];
        let types = arr[TYPE_LINE];
        let arrKeys = arr[START_LINE];

        let item, data, iskey;
        for (let i = DATA_LINE; i < arr.length; ++i) {
            item = arr[i];
            data = this.parseData(fields, types, item);
            let newData = retObj;
            let key;
            for (let j = 0; j < arrKeys.length - 1; j++) {
                key = arrKeys[j];
                newData = (newData[key] || (newData[key] = {}));
            }
            newData[item[arrKeys[arrKeys.length - 1]]] = data;
        }
        this.configs[name] = retObj;
        return retObj;
    }

    private parseData(fields: Object, types: Object, item: Object, isArray: boolean = false): Object {
        let obj = {};
        let type: string;
        let bArr: boolean;
        let bArr2: boolean;
        let key: string;
        let val: any;
        for (let k in fields) {
            type = types[k];
            key = fields[k];
            val = item[k];
            if (type && type != "") {

                let idx = type.indexOf("[");
                if (idx >= 0) {
                    bArr = true;
                    type = type.substr(idx + 1, type.lastIndexOf("]") - idx - 1);
                }

                let idx2 = type.indexOf("[");
                if (idx2 >= 0) {
                    bArr2 = true;
                    type = type.substr(idx2 + 1, type.lastIndexOf("]") - idx2 - 1);
                }

                if (bArr2) {
                    obj[key] = [];
                    for (const k1 in val) {
                        let arr2 = [];
                        for (const k2 in val[k1]) {
                            arr2.push(this.getCustomData(type, val[k1][k2]));
                        }
                        obj[key].push(arr2);
                    }
                } else if (bArr) {
                    obj[key] = [];
                    for (const k1 in val) {
                        obj[key].push(this.getCustomData(type, val[k1]));
                    }
                } else {
                    obj[key] = this.getCustomData(type, val);
                }


            } else {
                obj[key] = val;
            }
        }
        return obj;
    }

    private getCustomData(type: string, val: any) {
        let ret = null;
        let arrType = type.split(":");
        if (arrType.length == 2) {
            //引用表
            let cfg = this.getConfig(arrType[1]);
            if (cfg) {
                ret = cfg[val];
            } else {
                console.error("引用表不存在：" + type);
            }
        } else if (arrType.length == 1) {
            //自定义结构
            let arr = this.getOriginalConfig(type);
            if (arr) {
                let fields1 = arr[FIELD_LINE];
                let types1 = arr[TYPE_LINE];
                ret = this.parseData(fields1, types1, val);
            } else {
                console.error("自定义类型不存在或该表未设置被引用表（首行首列值应为1）：" + type);
            }
        } else {
            console.error("类型错误：" + type);
        }
        return ret;
    }
}
