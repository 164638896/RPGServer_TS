import { Session, Application } from 'pinus';
export class RouteUtil {
    static scene(session: Session, msg: any, app: Application, cb: (err: Error , serverId ?: string) => void) {
        let sceneId = session.get('sceneId');

        if (!sceneId) {
            cb(new Error('can not find server info for type: ' + msg.serverType));
            return;
        }

        cb(null, sceneId);
    }

    static connector(session: Session, msg: any, app: Application, cb: (err: Error , serverId ?: string) => void) {
        if (!session) {
            cb(new Error('fail to route to connector server for session is empty'));
            return;
        }

        if (!session.frontendId) {
            cb(new Error('fail to find frontend id in session'));
            return;
        }

        cb(null, session.frontendId);
    }
}