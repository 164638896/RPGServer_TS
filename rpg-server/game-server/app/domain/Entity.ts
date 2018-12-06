import {EventEmitter} from 'events';
import {EntityType} from '../consts/consts';
import {FRONTENDID} from "pinus/lib/util/constants";
import {UserSql} from "../mysql/UserSql";
import {MonsterAI} from "./MonsterAI";
import {BackendSession} from "pinus/lib/common/service/backendSessionService";
import {GameScene} from "./scene/GameScene";
import {invokeCallback} from 'pinus';
import { EntityData, PlayerData, MonsterData } from './EntityData';



export class Entity extends EventEmitter {
    protected mEntityData: EntityData;

    constructor(data: any, type: EntityType) {
        super();

        if (type === EntityType.Player) {
            this.mEntityData = new PlayerData(data);
        }
        else if (type === EntityType.Monster) {
            this.mEntityData = new MonsterData(data);
        }
    }

    getData(): EntityData {
        return this.mEntityData;
    }
}

export class Role extends Entity {
    move(x: number, y: number, z: number, dX: number, dZ: number) {
        //let oldPos = this.mEntityData.mPos;

        // let fX = x - oldPos.x;
        // let fY = y - oldPos.y;
        // let fZ = z - oldPos.z;

        this.mEntityData.setForward(dX, 0, dZ);
        this.mEntityData.setPos(x, y, z);
    }
}

export class Player extends Role {
    constructor(data: any, frontendId: FRONTENDID) {
        // test begin
        data.skillList = new Array<number>();
        for (let i = 1; i <= 4; ++i) {
            data.skillList.push(i);
        }
        //test end

        super(data, EntityType.Player);

        let playerData = this.mEntityData as PlayerData;
        playerData.mFrontendId = frontendId;
    }

    move(x: number, y: number, z: number, dX: number, dZ: number) {
        super.move(x, y, z, dX, dZ);

        UserSql.getInstance().updatePlayer(this, () => {

        });
    }

    changeScene(currScene: GameScene, targetServerId: string, session: BackendSession, cb: Function) {
        let playerData = this.getData() as PlayerData;
        // 更新数据库
        UserSql.getInstance().updatePlayer(this, () => {
            session.set('serverId', targetServerId);
            session.pushAll((err: any, result: any) => {

            });

            currScene.removeEntity(playerData.mInstId, EntityType.Player);

            invokeCallback(cb, null, null);
        });
    }
}

export class Npc extends Role {
    constructor(data: any) {
        super(data, EntityType.Npc);
    }
}

export class Monster extends Role {
    private mAi: MonsterAI;
    private lastTime: number;

    constructor(data: any) {
        super(data, EntityType.Monster);
        this.lastTime = Date.now();
        this.mAi = new MonsterAI(this);
        setInterval(this.tick.bind(this), 200);
    }

    tick() {
        let dt = Date.now() - this.lastTime;
        this.lastTime = Date.now();
        this.mAi.update(dt);
    }
}
