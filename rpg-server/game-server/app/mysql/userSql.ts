import {invokeCallback, pinus} from 'pinus';
import * as util from 'util';
import {Player} from '../domain/entity';
import {PlayerData} from "../domain/entityData";
import {Cfg} from "../config/Cfg";

export class UserSql {

    constructor() {

    }

    private static _instance = null;

    public static getInstance(): UserSql {
        if (UserSql._instance == null) {
            UserSql._instance = new UserSql();
        }
        return UserSql._instance;
    }

    // async getPlayersByUid(uid: number) {
    //
    //     let sql = 'select * from Player where userId = ?';
    //     let args = [uid];
    //
    //     return new Promise<any>((resolve, reject) => {
    //         pinus.app.get('dbclient').query(sql, args, function(err: any, res: any) {
    //             if (err !== null) {
    //                 reject(err.message);
    //             }
    //             if(!res || res.length <= 0) {
    //                 reject(err);
    //             } else {
    //                 resolve(res[0]);
    //             }
    //         });
    //
    //     });
    // }

    getPlayersByUidA = util.promisify(this.getPlayersByUid);

    async getPlayersByUid(uid: number, cb: Function) {
        let sql = 'select * from Player where userId = ?';
        let args = [uid];

        pinus.app.get('dbclient').query(sql, args, function (err: any, res: any) {
            if (err !== null) {
                invokeCallback(cb, err.message, null);
            } else if (!res || res.length <= 0) {
                invokeCallback(cb, null, null);
            } else {
                invokeCallback(cb, null, res[0]);
            }
        });
    }

    getPlayerByIdA = util.promisify(this.getPlayerById);

    async getPlayerById(name: string, cb: Function) {
        let sql = 'select * from Player where id = ?';
        let args = [name];

        pinus.app.get('dbclient').query(sql, args, function (err: any, res: any) {
            if (err !== null) {
                invokeCallback(cb, err.message, null);
            } else if (!res || res.length <= 0) {
                invokeCallback(cb, null, null);
            } else {
                invokeCallback(cb, null, res[0]);
            }
        });
    }

    getUserByNameA = util.promisify(this.getUserByName);

    async getUserByName(name: string, cb: Function) {
        let sql = 'select * from User where name = ?';
        let args = [name];

        pinus.app.get('dbclient').query(sql, args, function (err: any, res: any) {
            if (err !== null) {
                invokeCallback(cb, err.message, null);
            } else if (!res || res.length <= 0) {
                invokeCallback(cb, null, null);
            } else {
                invokeCallback(cb, null, res[0]);
            }
        });
    }

    createUserA = util.promisify(this.createUser);

    async createUser(username: string, password: string, from: string, cb: Function) {
        let sql = 'insert into User (name,password,`from`,loginCount,lastLoginTime) values(?,?,?,?,?)';
        let loginTime = Date.now();
        let args = [username, password, from || '', 1, loginTime];
        pinus.app.get('dbclient').query(sql, args, function (err, res) {
            if (err !== null) {
                invokeCallback(cb, err.message, null);
            } else if (!res || res.length <= 0) {
                invokeCallback(cb, null, null);
            }
            else {
                let user = {
                    id: res.insertId,
                    name: username,
                    password: password,
                    loginCount: 1,
                    lastLoginTime: loginTime
                };
                invokeCallback(cb, null, user);
            }
        });
    }

    createPlayerA = util.promisify(this.createPlayer);

    async createPlayer(uid: string, name: string, typeId: number, cb: Function) {
        let sql = 'insert into Player (userId, typeId, typeName, name, country, rank, level, exp, atk, def, hitRate, dodgeRate, moveSpeed, atkSpeed, hp, mp, maxHp, maxMp, areaId, x, y, z, dirX, dirY, dirZ, skillPoint) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let playerCfg = Cfg.player.getData(1);
        let role = {name: 'test', career: 'warrior', country: 1, gender: 'male'};
        let x = 0.29;
        let y = 0.282;
        let z = -2.6;
        let dirZ = 1;
        let areaId = 1;
        // role.country = 1;
        let args = [uid, typeId, 'test', name, 1, 1, 1, 0, playerCfg.atk, playerCfg.def, 0, 0, 1, 1, playerCfg.hp, 100, playerCfg.hp, 100, areaId, x, y, z, 0, 0, dirZ, 1];

        pinus.app.get('dbclient').query(sql, args, function (err, res) {
            if (err !== null) {
                console.error('create player failed! ' + err.message);
                console.error(err);
                invokeCallback(cb, err.message, null);
            } else {
                invokeCallback(cb, null, {
                    id: res.insertId,
                    userId: uid,
                    typeId: typeId,
                    typeName: role.name,
                    areaId: areaId,
                    name: name,
                    rank: 1,
                    level: 1,
                    exp: 0,
                    atk: playerCfg.atk,
                    def: playerCfg.def,
                    skillPoint: 1,
                    hitRate: 0,
                    dodgeRate: 0,
                    moveSpeed: 1,
                    atkSpeed: 1,
                });
            }
        });
    }

    updatePlayer(player: Player, cb: Function) {
        let sql = 'update Player set x = ? ,y = ? , x = ?, hp = ?, mp = ? , maxHp = ?, maxMp = ?, level = ?, exp = ?, areaId = ?, atk = ?, def = ?, moveSpeed = ?, atkSpeed = ? where id = ?';
        let data = player.getData() as PlayerData;
        let args = [data.mPos.x, data.mPos.y, data.mPos.z, data.mHp, data.mMp, data.mMaxHp, data.mMaxMp, data.mLevel, data.mExp, data.mAreaId, data.mAtk, data.mDef, data.mMoveSpeed, data.mAtkSpeed, data.id];
        pinus.app.get('dbclient').query(sql, args, function (err, res) {
            if (err !== null) {
                console.error('write mysql failed!　' + sql + ' ' + JSON.stringify(player) + ' stack:' + err.stack);
            }
            if (!!cb && typeof cb == 'function') {
                cb(!!err);
            }
        });
    }
}