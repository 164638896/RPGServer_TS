import {Channel} from 'pinus/lib/common/service/channelService';
import {pinus} from 'pinus';
import {GameScene} from "./GameScene";


export class SceneMgr {
    private mInstId: number;
    private mSceneList = {};

    constructor() {
        this.init();
    }

    private static _instance = null;

    public static getInstance(): SceneMgr {
        if (SceneMgr._instance == null) {
            SceneMgr._instance = new SceneMgr();
        }
        return SceneMgr._instance;
    }

    public init() {

    }

    public getScene(id: number): GameScene {
        return this.mSceneList[id];
    }

    public changeScene() {

    }


}