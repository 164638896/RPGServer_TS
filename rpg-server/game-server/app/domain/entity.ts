import {EventEmitter} from 'events';
import {FRONTENDID} from 'pinus/lib/util/constants';
import {EntityType} from '../consts/consts';
import {Vector3} from "../util/vector3";

export let mEntityInstId: number = 0;

export class Entity extends EventEmitter {
    public mInstId: number = 0;
    public mFrontendId: FRONTENDID;
    public mType: EntityType = EntityType.null;
    protected mAreaId: number;

    protected readonly mPos: Vector3;
    protected readonly mForward: Vector3;

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

    getInfo(): object {
        return {

        }
    }
}

export class Role extends Entity {
    public name: string;
    protected mHp: number = 100;
    protected mAtk: number = 1;
    protected mDef: number = 1;
    protected mMoveSpeed: number = 1;
    protected mLevel: number = 0;
    protected mSkillList: Array<number> = new Array<number>();

    constructor(opts: any,  type: EntityType) {
        super(opts, type);
        this.name = opts.name;
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

    constructor(playerData: any) {
        super(playerData, EntityType.PLAYER);
        this.uid = playerData.userId;
        this.id = playerData.id;

        for(let i =1; i <= 4; ++i) {
            this.mSkillList.push(i);
        }
    }

    getInfo(): object {
        return {
            type: this.mType,
            sceneId: this.mAreaId,
            instId: this.mInstId,
            moveSpeed: this.mMoveSpeed,
            atk: this.mAtk,
            def: this.mDef,
            hp: this.mHp,
            level: this.mLevel,
            pos: this.mPos,
            dir: this.mForward,
            skillList: this.mSkillList
        }
    }
}

export class Npc extends Role {

}

export class Monster extends Role {

}