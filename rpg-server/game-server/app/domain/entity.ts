import {EventEmitter} from 'events';
import {FRONTENDID} from 'pinus/lib/util/constants';
import {EntityType} from '../consts/consts';

export let mEntityInstId: number = 0;

export class Entity extends EventEmitter {
    public mInstId: number;
    public mFrontendId: FRONTENDID;
    public mType: EntityType;
    private mAreaId: number;

    private x: number;
    private y: number;
    private z: number;

    constructor(data: any, type: EntityType) {
        super();
        this.mInstId = ++mEntityInstId;
        this.mType = type;
        this.mAreaId = 1;
        this.x = 0.29;
        this.y = 0.282;
        this.z = -2.6;
    }

    getPos() {
        return {x: this.x, y: this.y, z: this.z};
    }

    setPos(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


export class Role extends Entity {
    constructor(opts: any,  type: EntityType) {
        super(opts, type);
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