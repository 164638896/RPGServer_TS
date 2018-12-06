import {BTSelector} from "./bt/Composites/BTSelector";
import {Monster, Player} from "./Entity";
import {BTAction, BTActionWait, BTActionWaitRandom} from "./bt/Actions/BTAction";
import {BTResult} from "./bt/BTConstants";
import {MonsterData} from "./EntityData";
import {Precondition, PreconditionNOT} from "./bt/Conditional/BTConditional";
import {BTSequence} from "./bt/Composites/BTSequence";
import {pinus} from "pinus";
import {EntityType} from "../consts/consts";
import {Vector3} from "../util/Vector3";
import {Channel} from "pinus/lib/common/service/channelService";
import {RandomUtils} from "../util/RandomUtils";
import {GameScene} from "./scene/gameScene";


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

    protected Execute(dt: number): BTResult {
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
        this.mMonsterData.mBornPoint.cloneTo(this.mMonsterData.mPos);
        this.mChannel.pushMessage('onRevive', {entity: this.mMonsterData});
    }

    protected Execute(dt: number): BTResult {
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

    protected Execute(dt: number): BTResult {
        return BTResult.Success;
    }
}

export class PatrolAction extends BTAction {
    private mMonsterData: MonsterData;
    private mChannel: Channel;
    private mScene: GameScene;

    constructor(data: MonsterData, channel: Channel, areaService: GameScene) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
        this.mScene = areaService;
    }

    protected Enter() {
        super.Enter();
    }

    protected Execute(dt: number): BTResult {
        // 移动
        let newX, newZ;
        if (Math.abs(this.mMonsterData.mPos.x - this.mMonsterData.mBornPoint.x) > 0.1) {
            newX = this.mMonsterData.mBornPoint.x;
        } else {
            newX = this.mMonsterData.mPos.x + RandomUtils.range(-0.2, 0.2);
        }
        if (Math.abs(this.mMonsterData.mPos.z - this.mMonsterData.mBornPoint.z) > 0.1) {
            newZ = this.mMonsterData.mBornPoint.z;
        } else {
            newZ = this.mMonsterData.mPos.z + RandomUtils.range(-0.2, 0.2);
        }

        let oldPos = this.mMonsterData.mPos.clone();
        this.mMonsterData.mPos.set(newX, this.mMonsterData.mPos.y, newZ);

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
    private mScene: GameScene;

    constructor(data: MonsterData, channel: Channel, scene: GameScene) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
        this.mScene = scene;
    }

    protected Enter() {
        super.Enter();
    }

    protected Execute(dt: number): BTResult {
        // 移动
        let player: Player = this.mScene.getEntity(this.mMonsterData.mTargetId, EntityType.Player) as Player;
        if (player) {

            let dir: Vector3 = Vector3.sub(player.getData().mPos, this.mMonsterData.mPos);
            this.mMonsterData.setForward(dir.x, 0, dir.z);

            let dist = Vector3.distance(player.getData().mPos, this.mMonsterData.mPos);
            if (dist > 0.3) {
                dist -= 0.3;
            }

            let maxStep = this.mMonsterData.mMoveSpeed * dt * 0.001; // 乘以经过的时间
            if (dist > maxStep) {
                dist = maxStep;
            }

            let addPos = this.mMonsterData.mForward.clone();
            addPos.scale(dist);
            this.mMonsterData.mPos.add(addPos);

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
    private mScene: GameScene;

    constructor(data: MonsterData, channel: Channel, areaService: GameScene) {
        super();
        this.mMonsterData = data;
        this.mChannel = channel;
        this.mScene = areaService;
    }

    protected Enter() {
        super.Enter();

        let player: Player = this.mScene.getEntity(this.mMonsterData.mTargetId, EntityType.Player) as Player;
        if (player) {
            let dir: Vector3 = Vector3.sub(player.getData().mPos, this.mMonsterData.mPos);
            dir.y = 0;
            dir.normalize();
            this.mMonsterData.mForward = dir;

            let targets = [];
            targets.push(this.mMonsterData.mTargetId);
            this.mChannel.pushMessage('onAttack', {
                skillId: 1,
                dX: dir.x,
                dZ: dir.z,
                attackId: this.mMonsterData.mInstId,
                targetIds: targets
            });
        }
    }

    protected Execute(dt: number): BTResult {
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

    protected Execute(dt: number): BTResult {
        return BTResult.Success;
    }
}

export class MonsterAI {
    private mMonster: Monster;
    private readonly mMonsterData: MonsterData;
    private mRoot: BTSelector;
    private mScene: GameScene;
    private mChannel: Channel;

    constructor(monster: Monster) {
        this.mMonster = monster;
        this.mMonsterData = monster.getData() as MonsterData;
        this.init();
    }

    update(dt: number) {
        this.mRoot.Tick(dt);
    }

    init() {
        this.mScene = pinus.app.get('scene');
        this.mChannel = this.mScene.getChannel();

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

        let atkRangeFun = () => {
            let id: number = this.mMonsterData.mTargetId;
            if (id) {

                let player: Player = this.mScene.getEntity(id, EntityType.Player) as Player;
                if (player) {
                    let dis = Vector3.distance(player.getData().mPos, this.mMonsterData.mPos);
                    if (dis <= 0.5) {
                        return true;
                    }
                    else if (dis > 5) {
                        this.mMonsterData.mTargetId = 0;
                    }
                }
                else {
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
            followSubtree.AddChild(new FollowAction(this.mMonsterData, this.mChannel, this.mScene));

            aliveSel.AddChild(followSubtree);
        }

        let atkSeq: BTSequence = new BTSequence();
        {
            //atkSeq.AddChild(canAtk);
            atkSeq.AddChild(hasTarget);
            atkSeq.AddChild(atkRange);
            //atkSeq.AddChild(HPMore);

            // 攻击Action
            atkSeq.AddChild(new BTActionWait(1000));
            atkSeq.AddChild(new AttackAction(this.mMonsterData, this.mChannel, this.mScene));
            atkSeq.AddChild(new BTActionWaitRandom(1000, 3000));

            aliveSel.AddChild(atkSeq);
        }

        let patrolSeq: BTSequence = new BTSequence();
        {
            //patrolSeq.AddChild(canMove);
            patrolSeq.AddChild(hasNoTarget);
            patrolSeq.AddChild(new BTActionWaitRandom(5000, 10000));

            // 巡逻Action
            patrolSeq.AddChild(new PatrolAction(this.mMonsterData, this.mChannel, this.mScene));

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