import {Channel} from 'pinus/lib/common/service/channelService';
import {pinus} from 'pinus';
import {Entity, Player} from '../domain/entity';
import {EntityType} from '../consts/consts';


export class AreaService {
    private mInstId: number;
    private channel: Channel = null;
    private entities = {}; // 所有物体实例包括player
    private playerIds = {}; // playerId->mInstId，为了给connector服务器使用

    private added = []; // the added entities in one tick
    private reduced = []; // the reduced entities in one tick

    constructor() {
        setInterval(this.tick.bind(this), 100);
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
    }

    addEntity(e: Entity): boolean {

        if (!e || !e.mInstId) {
            return false;
        }

        this.entities[e.mInstId] = e;

        if(e.mType === EntityType.PLAYER) {
            let player = e as Player;
            this.getChannel().add(player.uid, e.mFrontendId);

            if (!!this.playerIds[player.id]) {
                console.error('add player twice! player : %j', e);
            }
            this.playerIds[player.id] = e.mInstId;
        }

       // this.addEvent(e);

        this.added.push(e); // 100毫秒内的一起推送给玩家
        return true;
    }

    removeEntity(InstId: number) {

        let e: Entity = this.entities[InstId];
        if (!e) {
            return true;
        }

        if(e.mType === EntityType.PLAYER) {
            let player = e as Player;
            let channel = this.getChannel();
            channel.leave(player.uid, e.mFrontendId);
            delete this.playerIds[player.id];
        }

        delete this.entities[InstId];
        this.reduced.push(InstId); // 100毫秒内的一起推送给玩家

        // let param = {
        //     playerId: InstId,
        // };
        //
        // // 通知？
        // channel.pushMessage('onUserLeave', param);
    }

    getEntity(InstId: number): Entity {
        let e: Entity = this.entities[InstId];
        if (!e) {
            return null;
        }

        return this.entities[InstId];
    }

    getPlayerByPlayerId(playerId: number): Entity {
        let instId = this.playerIds[playerId];
        return this.getEntity(instId);
    }

    getAllPlayersEntity() {
        let _players = [];
        for (let id in this.playerIds) {
            _players.push(this.entities[this.playerIds[id]]);
        }

        return _players;
    }

    getChannel(): Channel {
        if (this.channel) {
            return this.channel;
        }

        this.channel = pinus.app.get('channelService').getChannel('area_' + this.mInstId, true);
        return this.channel;
    }

    getAllEntities(): object {
        return this.entities;
    }
}