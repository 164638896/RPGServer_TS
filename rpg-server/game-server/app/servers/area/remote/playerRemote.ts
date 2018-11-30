import {Application, FrontendSession, RemoterClass} from 'pinus';
import {AreaService} from '../../../services/areaService';
import {EntityType} from "../../../consts/consts";

export default function (app: Application) {
    return new PlayerRemote(app);
}

// UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        area: {
            // 一次性定义一个类自动合并到UserRpc中
            playerRemote: RemoterClass<FrontendSession, PlayerRemote>;
        };
    }
}


export class PlayerRemote {
    private areaService: AreaService;

    constructor(private app: Application) {
        this.areaService = this.app.get('areaService');
    }

    public async playerLeave(playerId: number, sid: string, name: string) {

        let player = this.areaService.getPlayerByPlayerId(playerId, EntityType.Player);
        if (!player) {
            return {code: 500, error: true};
        }

        this.areaService.removeEntity(player.getData().mInstId, EntityType.Player);
    }
}