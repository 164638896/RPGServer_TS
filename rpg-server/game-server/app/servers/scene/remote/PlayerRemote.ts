import {Application, FrontendSession, RemoterClass} from 'pinus';
import {EntityType} from "../../../consts/consts";
import {Entity} from "../../../domain/Entity";
import * as path from "path";
import {getLogger} from 'pinus-logger';
import {GameScene} from "../../../domain/scene/GameScene";

let logger = getLogger('pinus', path.basename(__filename));

export default function (app: Application) {
    return new PlayerRemote(app);
}

// UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        scene: {
            // 一次性定义一个类自动合并到UserRpc中
            PlayerRemote: RemoterClass<FrontendSession, PlayerRemote>;
        };
    }
}


export class PlayerRemote {
    private mScene: GameScene;

    constructor(private app: Application) {
        this.mScene = app.get('scene');
    }

    public async playerLeave(playerId: number, serverId: number, playerName: string) {

        if (!this.mScene) {
            logger.warn('Can not find scene');
            return {code: 500, error: true};
        }

        let player: Entity = this.mScene.getPlayerByPlayerId(playerId, EntityType.Player);
        if (!player) {
            return {code: 500, error: true};
        }

        this.mScene.removeEntity(player.getData().mInstId, EntityType.Player);
    }
}