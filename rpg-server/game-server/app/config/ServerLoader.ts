import {ILoader} from "./ConfigLoader";
import {ALL_CONFIG_FILES} from "./Cfg";


export class AreaServerLoader extends ILoader {
    private mOriginalData = {};

    load(caller: any, complete?: Function, progress?: Function) {
        for (const name of ALL_CONFIG_FILES) {
            let url = '../../data/' + name;
            this.mOriginalData[name] =  require(url);
        }
    }

    getOriginalData(name: string): any {
        return this.mOriginalData[name];
    }
}