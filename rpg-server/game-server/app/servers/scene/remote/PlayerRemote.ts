import {Application, FrontendSession, RemoterClass} from 'pinus';
import {EntityType} from "../../../consts/consts";
import {SceneMgr} from "../../../domain/scene/SceneMgr";
import {Entity} from "../../../domain/entity";
import * as path from "path";
import {getLogger} from 'pinus-logger';
let logger = getLogger('pinus', path.basename(__filename));

export default function (app: Application) {
    return new PlayerRemote(app);
}

// UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        scene: {
            // 一次性定义一个类自动合并到UserRpc中
            playerRemote: RemoterClass<FrontendSession, PlayerRemote>;
        };
    }
}


export class PlayerRemote {
    private mSceneMgr: SceneMgr;

    constructor(private app: Application) {
        this.mSceneMgr = app.get('sceneMgr');
    }

    public async playerLeave(playerId: number, sceneId: number, playerName: string) {

        let scene = this.mSceneMgr.getScene(sceneId);
        if(!scene) {
            logger.warn('Can not find scene');
            return {code: 500, error: true};
        }

        let player: Entity = scene.getPlayerByPlayerId(playerId, EntityType.Player);
        if (!player) {
            return {code: 500, error: true};
        }

        scene.removeEntity(player.getData().mInstId, EntityType.Player);
    }
}