import {Channel} from "pinus/lib/common/service/channelService";
import {EntityType} from "../../consts/consts";
import {Entity, Monster} from "../entity";
import {MonsterData, NpcData, PlayerData, RoleData} from "../entityData";
import {pinus} from "pinus";
import {RandomUtils} from "../../util/RandomUtils";


export class GameScene {
    private mInstId: number;
    private channel: Channel = null;
    private mEntityList = {};

    private playerIds = {}; // playerId->mInstId，为了给connector服务器使用

    private added = []; // the added entities in one tick
    private reduced = []; // the reduced entities in one tick

    constructor(instId: number) {
        this.mInstId = instId;
        this.mEntityList[EntityType.Player] = {};
        this.mEntityList[EntityType.Monster] = {};
        this.mEntityList[EntityType.Npc] = {};

        setInterval(this.tick.bind(this), 200);
    }

    tick() {
        this.entityUpdate();
    }

    entityUpdate() {
        if (this.reduced.length > 0) {

            this.getChannel().pushMessage('onRemoveEntities', {entities: this.reduced});

            this.reduced = [];
        }
        if (this.added.length > 0) {

            this.getChannel().pushMessage('onAddEntities', {entities: this.added});

            this.added = [];
        }

        let monsterList = this.mEntityList[EntityType.Monster];

        if (Object.keys(monsterList).length < 10) {
            this.generateMonster(1);
        }
    }

    addEntity(e: Entity): boolean {
        if (!e) {
            return false;
        }

        let data = e.getData();
        if (data.mType === EntityType.Player) {
            let playerData = data as PlayerData;
            this.getChannel().add(playerData.uid, playerData.mFrontendId);

            if (!!this.playerIds[playerData.id]) {
                console.error('add player twice! player : %j', e);
            }
            this.playerIds[playerData.id] = playerData.mInstId;
            this.mEntityList[EntityType.Player][playerData.mInstId] = e;
        }
        else if (data.mType === EntityType.Monster) {
            let monsterData = data as MonsterData;
            this.mEntityList[EntityType.Monster][monsterData.mInstId] = e;
        }
        else if (data.mType === EntityType.Npc) {
            let npcData = data as NpcData;
            this.mEntityList[EntityType.Npc][npcData.mInstId] = e;
        }

        this.added.push(data); // 100毫秒内的一起推送给玩家
        return true;
    }

    removeEntity(InstId: number, type: EntityType) {

        let e = this.mEntityList[type][InstId];
        if (!e) {
            return true;
        }

        let data = e.getData();

        if (data.mType === EntityType.Player) {
            let playerData = data as PlayerData;
            let channel = this.getChannel();
            channel.leave(playerData.uid, playerData.mFrontendId);
            delete this.playerIds[playerData.id];
        }

        delete this.mEntityList[type][InstId];

        this.reduced.push(InstId); // 100毫秒内的一起推送给玩家
    }

    getEntity(InstId: number, type: EntityType): Entity {

        let e = this.mEntityList[type][InstId];
        if (!e) {
            console.log("entiity is null type =", type, "InstId = ", InstId);
            return;
        }

        return e;
    }

    getPlayerByPlayerId(playerId: number, type: EntityType): Entity {
        let instId = this.playerIds[playerId];
        return this.getEntity(instId, type);
    }

    getEntityByType(type: EntityType): object {
        return this.mEntityList[type];
    }

    getAllEntities(): object {
        return this.mEntityList;
    }

    getChannel(): Channel {
        if (this.channel) {
            return this.channel;
        }

        this.channel = pinus.app.get('channelService').getChannel('area_' + this.mInstId, true);
        return this.channel;
    }

    getAllEntitiesInfo(): any {
        let eInfo = [];

        for (let type in this.mEntityList) {
            let entityArray = this.mEntityList[type];
            for (let i in entityArray) {
                let data = entityArray[i].getData();
                let roleData = data as RoleData;
                if (!roleData) {
                    if (roleData.mHp <= 0) {
                        continue;
                    }
                }

                eInfo.push(data);
            }
        }

        return eInfo;
    }

    // 生成怪物
    generateMonster(n: number) {
        if (!n) {
            return;
        }
        for (let i = 0; i < n; i++) {

            //let data: any = DataApi.getInstance().mCharacter.findById(2);
            let m: Monster = new Monster({
                sceneId: this.mInstId,
                name: 'monster',
                x: RandomUtils.range(-4, 4), y: 0.282, z: RandomUtils.range(-3.5, -2),
                dirX: RandomUtils.range(-1, 1), dirY: 0, dirZ: RandomUtils.range(-1, 1),
                moveSpeed: 0.5,
                hp: 100,
            });
            this.addEntity(m);
        }
    }
}