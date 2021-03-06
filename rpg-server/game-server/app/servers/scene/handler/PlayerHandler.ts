import {Application, BackendSession, pinus} from 'pinus';
import {Entity, Player} from '../../../domain/Entity';

import {getLogger} from 'pinus-logger';
import * as path from 'path';
import {EntityType} from "../../../consts/consts";
import {RoleData} from "../../../domain/EntityData";
import {MathUtils} from "../../../util/MathUtils";
import {GameScene} from "../../../domain/scene/GameScene";
import {UserSql} from "../../../mysql/UserSql";

let logger = getLogger('pinus', path.basename(__filename));


export default function (app: Application) {
    return new PlayerHandler(app);
}


export class PlayerHandler {
    private mScene: GameScene;
    constructor(private app: Application) {
        this.mScene = pinus.app.get('scene');
    }

    async enterScene(msg: { playerId: string }, session: BackendSession) {
        let playerId = session.get('playerId');

        let mysqlPlayerData: any = await UserSql.getInstance().getPlayerByIdA(playerId);
        if (!mysqlPlayerData) {
            logger.warn('Can not find playerId =', playerId);
            return {code: 500, error: true};
        }

        if (!this.mScene) {
            logger.warn('Can not find scene! serverId = ', mysqlPlayerData.serverId);
            return {code: 500, error: true};
        }

        let instId = this.mScene.generatePlayer(mysqlPlayerData, session.frontendId);

        return {code: 200, entities: this.mScene.getAllEntitiesInfo(), curPlayerInstId: instId};
    }

    async changeScene(msg: { currSceneId: string, targetSceneId: string }, session: BackendSession) {

        let playerId = session.get('playerId');

        let player = this.mScene.getPlayerByPlayerId(playerId, EntityType.Player) as Player;
        if (!player) {
            return {code: 500, error: true};
        }

        player.changeScene(this.mScene, msg.targetSceneId, session, () => {
            return  {code: 200};
        });
    }

    async move(msg: { x: number, y: number, z: number, dX: number, dZ: number }, session: BackendSession) {
        let playerId = session.get('playerId');

        if (!this.mScene) {
            logger.warn('Can not find scene');
            return {code: 500, error: true};
        }

        let player: Player = this.mScene.getPlayerByPlayerId(playerId, EntityType.Player) as Player;
        if (!player) {
            logger.error('Move without a valid player ! playerId : %j', playerId);
            return {code: 500, error: 'invalid player:' + playerId};
        }

        player.move(msg.x, msg.y, msg.z, msg.dX, msg.dZ);
        let playerData = player.getData();
        let pos = playerData.mPos;
        this.mScene.getChannel().pushMessage('onMove', {
            InstId: playerData.mInstId,
            x: pos.x,
            y: pos.y,
            z: pos.z
        });

        return {code: 200};
    }

    async skill(msg: { skillId: number, playerInstId: number }, session: BackendSession) {

        if (!this.mScene) {
            logger.warn('Can not find scene');
            return {code: 500, error: true};
        }

        let player: Player = this.mScene.getEntity(msg.playerInstId, EntityType.Player) as Player;
        if (!player) {
            logger.error('skill without a valid player ! playerInstId : %j', msg.playerInstId);
            return {code: 500, error: 'invalid playerInstId:' + msg.playerInstId};
        }

        let playerData = player.getData();

        let targets = [];
        let pos = playerData.mPos;
        let forward = playerData.mForward;
        let allEntities = this.mScene.getAllEntities();
        for (let type in allEntities) {
            let entities = allEntities[type];
            for (let i in entities) {
                let e = entities[i] as Entity;
                let eData = e.getData() as RoleData;
                let tPos = eData.mPos;

                if (playerData.mInstId !== eData.mInstId) {
                    if (MathUtils.IsPointInCircularSector(pos.x, pos.z, forward.x, forward.z, 0.5, MathUtils.getRadian(120) * 0.5, tPos.x, tPos.z)) {
                        targets.push(eData.mInstId);
                        eData.mTargetId = playerData.mInstId; // 设置怪物目标
                        eData.mHp -= 10;
                    }
                }
            }
        }

        this.mScene.getChannel().pushMessage('onAttack', {
            skillId: msg.skillId,
            attackId: msg.playerInstId,
            targetIds: targets
        });
    }
}