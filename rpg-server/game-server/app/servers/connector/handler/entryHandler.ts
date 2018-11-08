import {Application, FrontendSession, pinus} from 'pinus';
import { getLogger } from 'pinus-logger';
import * as path from 'path';
import {UserSql} from '../../../mysql/userSql';
let logger = getLogger('pinus', path.basename(__filename));

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    private readonly serverId: string;

    constructor(private app: Application) {
        let serverName = app.get('serverId');
        this.serverId = serverName.split('-')[2];
    }

    async entry(msg: { name: string }, session: FrontendSession) {

        let userData: any = await UserSql.getInstance().getUserByNameA(msg.name);
        if(!userData) {
            // logger.error('userData is null');
            // return { code: 500, error: true };
            userData = await UserSql.getInstance().createUserA(msg.name, '', '');
        }

        await session.abind(userData.id);

        let playerData: any = await UserSql.getInstance().getPlayersByUidA(userData.id);
        if(!playerData) {
            // logger.error('playerData is null');
            // return { code: 500, error: true };
            playerData = await UserSql.getInstance().createPlayerA(userData.id, msg.name, 210);
        }
        console.log('playerData: ', playerData);

        session.set('playerName', playerData.name);
        session.set('playerId', playerData.id); // connector 只有 player id，没法绑定具体的Player实例Id，因为playerId 是在area服务器上创建的
        session.set('areaId', 1);
        session.on('closed', this.onUserLeave.bind(this));
        session.pushAll((err: any, result: any) => { // FrontendSession推送到真正的session里，这样创建的BackendSession 里面也可以取到

        });

        return { code: 200, playerId: playerData.id };
    }

    onUserLeave(session: FrontendSession) {
        if (!session || !session.uid) {
            return;
        }

        this.app.rpc.area.playerRemote.playerLeave.route(session)(session.get('playerId'), session.get('areaId'), session.get('playerName'));
    }
}