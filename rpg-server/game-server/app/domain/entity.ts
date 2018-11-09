import {EventEmitter} from 'events';
import {FRONTENDID} from 'pinus/lib/util/constants';
import {EntityType} from '../consts/consts';
import {Vector3} from "../util/vector3";

export let mEntityInstId: number = 0;

export class Entity extends EventEmitter {
    public mInstId: number;
    public mFrontendId: FRONTENDID;
    public mType: EntityType;
    private mAreaId: number;

    private readonly mPos: Vector3;
    private readonly mForward: Vector3;

    constructor(data: any, type: EntityType) {
        super();
        this.mInstId = ++mEntityInstId;
        this.mType = type;
        this.mAreaId = 1;
        this.mPos = new Vector3(0.29, 0.282, -2.6);
        this.mForward = new Vector3(0, 0, 1);
    }

    getPos() : Vector3 {
        return this.mPos;
    }

    setPos(x: number, y: number, z: number) {
        this.mPos.set(x, y, z);
    }

    getForward() : Vector3 {
        return this.mForward;
    }

    setForward(x: number, y: number, z: number) {
        this.mForward.set(x, y, z);
    }
}


export class Role extends Entity {
    constructor(opts: any,  type: EntityType) {
        super(opts, type);
    }

    move(x: number, y: number, z: number) {
        let oldPos = this.getPos();
        let fX = x - oldPos.x;
        let fY = y - oldPos.y;
        let fZ = z - oldPos.z;

        this.setForward(fX, fY, fZ);
        this.setPos(x, y, z);
    }
}

export class Player extends Role {
    public uid: string; // 用户名Id，数据库用户表里的用户Id, 表示这个角色是哪个用户的
    public  id: number; // playerId, connector 调用 area服务器时候需要用到这个Id，要通过 playerId 找到真正的InstId, playerId 服务器之间内部使用，给客户端使用的InstId
    public name: string;

    constructor(playerData: any) {
        super(playerData, EntityType.PLAYER);
        this.uid = playerData.userId;
        this.id = playerData.id;
        this.name = playerData.name;
    }
}