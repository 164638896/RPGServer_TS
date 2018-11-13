import {Channel} from 'pinus/lib/common/service/channelService';
import {pinus} from 'pinus';
import {Entity, Monster, Npc, Player} from '../domain/entity';
import {EntityType} from '../consts/consts';
import {DataApi} from "../util/dataApi";
import {Vector3} from "../util/vector3";
import * as RandomUtils from "../util/RandomUtils";
import {MonsterData, NpcData, PlayerData} from "../domain/entityData";


export class AreaService {
    private mInstId: number;
    private channel: Channel = null;
    private mEntityList = {};

    private playerIds = {}; // playerId->mInstId，为了给connector服务器使用

    private added = []; // the added entities in one tick
    private reduced = []; // the reduced entities in one tick

    constructor() {
        this.mEntityList[EntityType.Player] = {};
        this.mEntityList[EntityType.Monster] = {};
        this.mEntityList[EntityType.Npc] = {};

        setInterval(this.tick.bind(this), 200);
        this.generateMonster(10);
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

        if( Object.keys(monsterList).length < 20) {
            this.generateMonster(5);
        }

        for (let i in monsterList) {
            monsterList[i].update();
        }
    }

    addEntity(e: Entity): boolean {
        if (!e) {
            return false;
        }

        let data = e.getData();
        if(data.mType === EntityType.Player) {
            let playerData = data as PlayerData;
            this.getChannel().add(playerData.uid, playerData.mFrontendId);

            if (!!this.playerIds[playerData.id]) {
                console.error('add player twice! player : %j', e);
            }
            this.playerIds[playerData.id] = playerData.mInstId;
            this.mEntityList[EntityType.Player][playerData.mInstId] = e;
        }
        else if(data.mType === EntityType.Monster) {
            let monsterData = data as MonsterData;
            this.mEntityList[EntityType.Monster][monsterData.mInstId] = e;
        }
        else if(data.mType === EntityType.Npc) {
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

        if(data.mType === EntityType.Player) {
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
        if(!e)
        {
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

    getAllEntities () : object{
        return this.mEntityList;
    }

    getChannel(): Channel {
        if (this.channel) {
            return this.channel;
        }

        this.channel = pinus.app.get('channelService').getChannel('area_' + this.mInstId, true);
        return this.channel;
    }

    // getAllEntities(): object {
    //     return this.entities;
    // }

    getAllEntitiesInfo(): any {
        let eInfo = [];

        for(let type in this.mEntityList) {
            let entityArray = this.mEntityList[type];
            for (let i in entityArray) {
                eInfo.push(entityArray[i].getData());
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
            let m: Monster = new Monster({name: 'monster', x: RandomUtils.limit(-4, 4), y: 0.282, z: RandomUtils.limit(-3.5, -2)}, EntityType.Monster);
            this.addEntity(m);
        }
    }
}