import {BackendSession} from "pinus/lib/common/service/backendSessionService";
import {pinus} from "pinus";
import {SceneMgr} from "../../../domain/scene/SceneMgr";

export default function () {
    return new PlayerFilter();
}

export class PlayerFilter {

    async before(msg: any, session: BackendSession) {

        // let sceneMgr: SceneMgr = pinus.app.get('sceneMgr');
        // let sceneId = session.get('sceneId');
        // if(sceneId) {
        //     let scene = sceneMgr.getScene(sceneId);
        //     session.set('scene', scene);
        //     session.set('sceneId', sceneId);
        // }

        return {code: 200};
    }
}