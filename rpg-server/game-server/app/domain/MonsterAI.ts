import {BTSelector} from "./bt/Composites/BTSelector";
import {Monster, Player} from "./entity";
import {BTAction, BTActionWait, BTActionWaitRandom} from "./bt/Actions/BTAction";
import {BTResult} from "./bt/BTConstants";
import {MonsterData} from "./entityData";
import {Precondition, PreconditionNOT} from "./bt/Conditional/BTConditional";
import {BTSequence} from "./bt/Composites/BTSequence";
import {pinus} from "pinus";
import {AreaService} from "../services/areaService";
import {EntityType} from "../consts/consts";
import {Vector3} from "../util/vector3";
import {Channel} from "pinus/lib/common/service/channelService";
import {RandomUtils} from "../util/RandomUtils";


export class DealAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;

    constructor(data: MonsterData, channel: Channel) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
    }

    protected Enter() {
        super.Enter();
        this.mChannel.pushMessage('onDead', {InstId: this.mMonsterData.mInstId});
    }

    protected Execute(): BTResult {
        return BTResult.Success;
    }
}

export class ReviveAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;

    constructor(data: MonsterData, channel: Channel) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
    }

    protected Enter() {
        super.Enter();
        this.mMonsterData.mHp = 100;
        this.mMonsterData.mTargetId = 0;
        this.mChannel.pushMessage('onRevive', {entity: this.mMonsterData});
    }

    protected Execute(): BTResult {
        return BTResult.Success;
    }
}

export class IdleAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;

    constructor(data: MonsterData, channel: Channel) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
    }

    protected Enter() {
        super.Enter();
    }

    protected Execute(): BTResult {
        return BTResult.Success;
    }
}

export class PatrolAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;
    private mAreaService: AreaService;

    constructor(data: MonsterData, channel: Channel, areaService: AreaService) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
        this.mAreaService = areaService;
    }

    protected Enter() {
        super.Enter();
    }

    protected Execute(): BTResult {
        // 移动
        let newX, newZ;
        if(Math.abs(this.mMonsterData.mPos.x - this.mMonsterData.mBornPoint.x) > 0.3) {
            newX = this.mMonsterData.mBornPoint.x;
        } else{
            newX = this.mMonsterData.mPos.x + RandomUtils.range(-0.2,0.2);
        }
        if(Math.abs(this.mMonsterData.mPos.z - this.mMonsterData.mBornPoint.z) > 0.3) {
            newZ = this.mMonsterData.mBornPoint.z;
        }else{
            newZ = this.mMonsterData.mPos.z + RandomUtils.range(-0.2,0.2);
        }

        let oldPos = this.mMonsterData.mPos.clone();
        this.mMonsterData.mPos.set(newX,this.mMonsterData.mPos.y, newZ);

        let dir = Vector3.sub(this.mMonsterData.mPos, oldPos);
        dir.y = 0;
        dir.normalize();
        this.mMonsterData.mForward = dir;

        this.mChannel.pushMessage('onMove', {
            InstId: this.mMonsterData.mInstId,
            x: this.mMonsterData.mPos.x,
            y: this.mMonsterData.mPos.y,
            z: this.mMonsterData.mPos.z
        });
        return BTResult.Success;
    }
}

export class FollowAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;
    private mAreaService: AreaService;

    constructor(data: MonsterData, channel: Channel, areaService: AreaService) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
        this.mAreaService = areaService;
    }

    protected Enter() {
        super.Enter();
    }

    protected Execute(): BTResult {
        // 移动
        let player: Player = this.mAreaService.getEntity(this.mMonsterData.mTargetId, EntityType.Player) as Player;
        if(player) {

            let dir: Vector3 = Vector3.sub(player.getData().mPos, this.mMonsterData.mPos);
            dir.y = 0;
            dir.normalize();
            this.mMonsterData.mForward = dir;

            dir.x *= 0.2;
            dir.z *= 0.2;
            this.mMonsterData.mPos.add(dir);

            this.mChannel.pushMessage('onMove', {
                InstId: this.mMonsterData.mInstId,
                x: this.mMonsterData.mPos.x,
                y: this.mMonsterData.mPos.y,
                z: this.mMonsterData.mPos.z
            });
            return BTResult.Success;
        }
    }
}

export class AttackAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;
    private mAreaService: AreaService;

    constructor(data: MonsterData, channel: Channel, areaService: AreaService) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
        this.mAreaService = areaService;
    }

    protected Enter() {
        super.Enter();

        let player: Player = this.mAreaService.getEntity(this.mMonsterData.mTargetId, EntityType.Player) as Player;
        if(player) {
            let dir: Vector3 = Vector3.sub(player.getData().mPos, this.mMonsterData.mPos);
            dir.y = 0;
            dir.normalize();
            this.mMonsterData.mForward = dir;

            let targets = [];
            targets.push(this.mMonsterData.mTargetId);
            this.mChannel.pushMessage('onAttack', {skillId: 1, dX: dir.x, dZ: dir.z, attackId: this.mMonsterData.mInstId, targetIds: targets});
        }
    }

    protected Execute(): BTResult {
        return BTResult.Success;
    }
}

export class RunAwayAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;

    constructor(data: MonsterData, channel: Channel) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
    }

    protected Enter() {
        super.Enter();
    }

    protected Execute(): BTResult {
        return BTResult.Success;
    }
}

export class MonsterAI {
    private mMonster: Monster;
    private readonly mMonsterData: MonsterData;
    private mRoot: BTSelector;
    private mAreaService: AreaService;
    private mChannel: Channel;

    constructor(monster: Monster) {
        this.mMonster = monster;
        this.mMonsterData = monster.getData() as MonsterData;
        this.init();
    }

    update() {
        this.mRoot.Tick();
    }

    init() {
        this.mAreaService = pinus.app.get('areaService');
        this.mChannel = this.mAreaService.getChannel();

        let isDeadFun = () => {
            return this.mMonsterData.mHp <= 0;
            // if (this.mMonsterData.mHp <= 0) {
            //     return true;
            // }
            // else {
            //     return false;
            // }
        };

        let targetFun = () => {
            let id: number = this.mMonsterData.mTargetId;
            return id > 0;
            // if (id) {
            //     return true;
            // }
            // else{
            //     return false;
            // }
        };

        let atkRangeFun = () =>
        {
            let id: number = this.mMonsterData.mTargetId;
            if (id) {

                let player: Player = this.mAreaService.getEntity(id, EntityType.Player) as Player;
                if(player)
                {
                    let dis = Vector3.distance(player.getData().mPos, this.mMonsterData.mPos);
                    if(dis <= 0.5){
                        return true;
                    }
                    else if(dis > 5) {
                        this.mMonsterData.mTargetId = 0;
                    }
                }
                else{
                    this.mMonsterData.mTargetId = 0;
                }
            }

            return false;
        };

        // let canMoveFun = () => { return this.mMonsterData.mBuffSystem.CanMove(); };
        // let canAtkFun = () => { return this.mMonsterData.mBuffSystem.CanAtk(); };

        let alive = new PreconditionNOT(isDeadFun, '活');
        let dead = new Precondition(isDeadFun, "死");
        let hasTarget = new Precondition(targetFun, "发现目标");
        let hasNoTarget = new PreconditionNOT(targetFun, "无目标");
        let atkRange = new Precondition(atkRangeFun, "在攻击范围内");
        let noAtkRange = new PreconditionNOT(atkRangeFun, "超出攻击范围");


        // BT
        this.mRoot = new BTSelector();
        this.mRoot.name = "Root";
        this.mRoot.Activate();

        let deadSeq: BTSequence = new BTSequence();
        {
            deadSeq.AddChild(dead);
            // 死亡Action
            deadSeq.AddChild(new DealAction(this.mMonsterData, this.mChannel));
            deadSeq.AddChild(new BTActionWait(5000));
            deadSeq.AddChild(new ReviveAction(this.mMonsterData, this.mChannel));
            this.mRoot.AddChild(deadSeq);
        }

        let aliveSel: BTSelector = new BTSelector();
        let aliveSeq: BTSequence = new BTSequence();
        {
            aliveSeq.AddChild(alive);
            aliveSeq.AddChild(aliveSel);
            this.mRoot.AddChild(aliveSeq);
        }

        let followSubtree: BTSequence = new BTSequence();
        {
            //followSubtree.AddChild(canMove);
            followSubtree.AddChild(hasTarget);
            followSubtree.AddChild(noAtkRange);
            //followSubtree.AddChild(HPMore);

            // 追击Action
            followSubtree.AddChild(new FollowAction(this.mMonsterData,  this.mChannel, this.mAreaService));

            aliveSel.AddChild(followSubtree);
        }

        let atkSeq: BTSequence= new BTSequence();
        {
            //atkSeq.AddChild(canAtk);
            atkSeq.AddChild(hasTarget);
            atkSeq.AddChild(atkRange);
            //atkSeq.AddChild(HPMore);

            // 攻击Action
            atkSeq.AddChild(new AttackAction(this.mMonsterData, this.mChannel, this.mAreaService));
            atkSeq.AddChild(new BTActionWaitRandom(2000, 3000));

            aliveSel.AddChild(atkSeq);
        }

        let patrolSeq: BTSequence = new BTSequence();
        {
            //patrolSeq.AddChild(canMove);
            patrolSeq.AddChild(hasNoTarget);
            patrolSeq.AddChild(new BTActionWaitRandom(3000, 10000));

            // 巡逻Action
            patrolSeq.AddChild(new PatrolAction(this.mMonsterData, this.mChannel, this.mAreaService));

            aliveSel.AddChild(patrolSeq);
        }

        let IdleSeq: BTSequence = new BTSequence();
        {
            IdleSeq.AddChild(hasNoTarget);

            // 休息Action
            IdleSeq.AddChild(new IdleAction(this.mMonsterData, this.mChannel));

            aliveSel.AddChild(IdleSeq);
        }
    }
}