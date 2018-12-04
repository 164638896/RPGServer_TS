
import {FRONTENDID} from "pinus/lib/util/constants";
import {EntityType} from "../consts/consts";
import {Vector3} from "../util/vector3";


export let gEntityInstId: number = 0;

export class EntityData {
    mInstId: number = 0;
    mType: EntityType = EntityType.None;
    mSceneId: number = 0;
    mPos: Vector3;
    mForward: Vector3;

    constructor(data: any, type: EntityType) {
        this.mInstId = ++gEntityInstId;
        this.mType = type;
        this.mSceneId = data.sceneId;
        this.mPos = new Vector3(data.x, data.y, data.z);
        this.mForward = new Vector3(data.dirX, data.dirY, data.dirZ);
    }

    setPos(x: number, y: number, z: number) {
        this.mPos.set(x, y, z);
    }

    setForward(x: number, y: number, z: number) {
        this.mForward.set(x, y, z);
        this.mForward.normalize();
    }
}

export class RoleData extends EntityData {
    mSceneId: number = 0;
    mName: string;
    mHp: number = 0;
    mMp: number = 0;
    mMaxHp: number = 0;
    mMaxMp: number = 0;
    mAtk: number = 0;
    mDef: number = 0;
    mMoveSpeed: number = 0;
    mAtkSpeed: number = 0;
    mLevel: number = 0;
    mSkillList: Array<number>;

    mTargetId: number = 0;

    constructor(data: any, type: EntityType) {
        super(data, type);

        this.mSceneId = Number(data.sceneId || 1);
        this.mName = data.name;
        this.mHp = data.hp;
        this.mMp = data.mp;
        this.mAtk = data.atk;
        this.mDef = data.def;
        this.mMoveSpeed = data.moveSpeed;
        this.mLevel = data.level;
        this.mSkillList = data.skillList;
    }
}

export class PlayerData extends RoleData {
    uid: string; // 用户名Id，数据库用户表里的用户Id, 表示这个角色是哪个用户.
    id: number;  // playerId, connector 调用 area服务器时候需要用到这个Id，要通过 playerId 找到真正的InstId, playerId 服务器之间内部使用，给客户端使用的InstId
    mFrontendId: FRONTENDID;

    mExp: number;

    constructor(data: any) {
        super(data, EntityType.Player);
        this.uid = data.userId;
        this.id = data.id;
    }
}

export class MonsterData extends RoleData {
    mBornPoint: Vector3;

    constructor(data: any) {
        super(data, EntityType.Monster);
        this.mBornPoint = new Vector3(data.x, data.y, data.z);
    }
}

export class NpcData extends RoleData {

}