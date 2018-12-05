import {Application, BackendSession, pinus} from 'pinus';
import {Entity, Player} from '../../../domain/entity';

import {getLogger} from 'pinus-logger';
import * as path from 'path';
import {EntityType} from "../../../consts/consts";
import {RoleData} from "../../../domain/entityData";
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
        this.mScene = app.get('scene');
    }

    async enterScene(msg: { playerId: string }, session: BackendSession) {
        let playerId = session.get('playerId');

        let playerData: any = await UserSql.getInstance().getPlayerByIdA(playerId);
        if (!playerData) {
            logger.warn('Can not find playerId =', playerId);
            return {code: 500, error: true};
        }

        if (!this.mScene) {
            logger.warn('Can not find scene =', playerData.mSceneId);
            return {code: 500, error: true};
        }

        let player = new Player(playerData, session.frontendId);

        this.mScene.addEntity(player);

        return {code: 200, entities: this.mScene.getAllEntitiesInfo(), curPlayerInstId: player.getData().mInstId};
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