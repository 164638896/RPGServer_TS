let character = require('../../data/character');

export class Data {
    private readonly data = {};
    constructor(data) {

        let fields = {};
        data[1].forEach((i, k) => {
            fields[i] = k;
        });
        data.splice(0, 2);

        let result = {}, item;
        data.forEach((k) => {
            item = this.mapData(fields, k);
            result[item.id] = item;
        });

        this.data = result;
    }

    mapData(fields, item) {
        let obj = {};
        for (let k in fields) {
            obj[k] = item[fields[k]];
        }
        return obj;
    }

    findBy(attr, value) {
        let result = [];
        let i, item;
        for (i in this.data) {
            item = this.data[i];
            if (item[attr] === value) {
                result.push(item);
            }
        }
        return result;
    }

    findBigger(attr, value) {
        let result = [];
        value = Number(value);
        let i, item;
        for (i in this.data) {
            item = this.data[i];
            if (Number(item[attr]) >= value) {
                result.push(item);
            }
        }
        return result;
    }

    findSmaller(attr, value) {
        let result = [];
        value = Number(value);
        let i, item;
        for (i in this.data) {
            item = this.data[i];
            if (Number(item[attr]) <= value) {
                result.push(item);
            }
        }
        return result;
    }

    findById(id) {
        return this.data[id];
    }
}


export class DataApi {
    mCharacter: Data;
    constructor() {

    }

    private static _instance = null;

    public static getInstance(): DataApi {
        if (DataApi._instance == null) {
            DataApi._instance = new DataApi();
        }
        return DataApi._instance;
    }

    public init() {
        this.mCharacter = new Data(character);
    }
}
