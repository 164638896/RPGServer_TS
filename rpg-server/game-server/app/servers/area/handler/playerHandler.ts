import {Application, BackendSession, pinus} from 'pinus';
import {Player} from '../../../domain/entity';
import {AreaService} from '../../../services/areaService';

import { getLogger } from 'pinus-logger';
import * as path from 'path';
import {UserSql} from '../../../mysql/userSql';
let logger = getLogger('pinus', path.basename(__filename));

export default function(app: Application) {
    return new PlayerHandler(app);
}

export class PlayerHandler {
    private mAreaService: AreaService;
    constructor(private app: Application) {
        this.mAreaService = app.get('areaService');
    }

    async enterScene(msg: { name: string, playerId: string }, session: BackendSession) {
        let playerId = session.get('playerId');

        let playerData: any = await UserSql.getInstance().getPlayerByIdA(playerId);
        if(!playerData) {
            logger.warn('Can not find playerId =', playerId);
            return { code: 500, error: true };
        }

        let player = new Player(playerData);
        player.mFrontendId = session.frontendId;

        this.mAreaService.addEntity(player);

        return { code: 200, entities: this.mAreaService.getAllEntities(), curPlayerInstId: player.mInstId };
    }

    async move(msg: {x: number, y: number, z: number}, session: BackendSession) {
        let playerId = session.get('playerId');
        let player: Player = this.mAreaService.getPlayerByPlayerId(playerId) as Player;
        if(!player) {
            logger.error('Move without a valid player ! playerId : %j', playerId);
            return { code: 500, error: 'invalid player:' + playerId };
        }

        this.mAreaService.getChannel().pushMessage('onMove', {InstId: player.mInstId, x: msg.x, y: msg.y, z: msg.z});

        return { code: 200 };
    }

    async skill(msg: {skillId: number, playerInstId: number}, session: BackendSession) {

        let player: Player = this.mAreaService.getEntity(msg.playerInstId) as Player;
        if(!player) {
            logger.error('skill without a valid player ! playerInstId : %j', msg.playerInstId);
            return { code: 500, error: 'invalid playerInstId:' + msg.playerInstId };
        }

        this.mAreaService.getChannel().pushMessage('onAttack', {skillId: msg.skillId, playerInstId: msg.playerInstId, targetInstId: 0});
    }
}