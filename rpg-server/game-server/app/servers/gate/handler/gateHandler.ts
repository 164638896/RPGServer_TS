import {Application} from 'pinus';
import {dispatch} from '../../../util/dispatcher';
import { getLogger } from 'pinus-logger';
import * as path from 'path';
let logger = getLogger('pinus', path.basename(__filename));

export default function (app: Application) {
    return new GateHandler(app);
}

export class GateHandler {
    constructor(private app: Application) {

    }

    async queryEntry(msg: { uid: string }) {

        let uid = msg.uid;
        if(!uid) {
            logger.warn('uid is null');
            return { code: 500, error: true };
        }

        let connectors = this.app.getServersByType('connector');
        if(!connectors || connectors.length === 0) {
            logger.warn('connectors is null');
            return { code: 500, error: true };
        }

        let res = dispatch(uid, connectors);
        if(!res) {
            logger.warn('Search server failed');
            return { code: 500, error: true };
        }

        return { code: 200, host: res.host, port: res.clientPort };
    }
}