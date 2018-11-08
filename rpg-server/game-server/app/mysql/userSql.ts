import {invokeCallback, pinus} from 'pinus';
import * as util from 'util';
import {Player} from '../domain/entity';
import {DataApi} from '../util/dataApi';

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

        pinus.app.get('dbclient').query(sql, args, function(err: any, res: any) {
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

        pinus.app.get('dbclient').query(sql, args, function(err: any, res: any) {
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

        pinus.app.get('dbclient').query(sql, args, function(err: any, res: any) {
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
        pinus.app.get('dbclient').query(sql, args, function(err, res) {
            if(err !== null) {
                invokeCallback(cb, err.message, null);
            } else if (!res || res.length <= 0) {
                invokeCallback(cb, null, null);
            }
            else {
                let user = {id: res.insertId, name: username, password: password, loginCount: 1, lastLoginTime: loginTime};
                invokeCallback(cb, null, user);
            }
        });
    }

    createPlayerA = util.promisify(this.createPlayer);
    async createPlayer(uid: string, name: string, typeId: number, cb: Function) {
        let sql = 'insert into Player (userId, kindId, kindName, name, country, rank, level, experience, attackValue, defenceValue, hitRate, dodgeRate, walkSpeed, attackSpeed, hp, mp, maxHp, maxMp, areaId, x, y, skillPoint) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        // let role = dataApi.role.findById(roleId);
        let character: any = DataApi.getInstance().mCharacter.findById(typeId);
        let role = {name: character.englishName, career: 'warrior', country: 1, gender: 'male'};
        let x = 0;
        let y = 0;
        let areaId = 0;
        // role.country = 1;
        let args = [uid, typeId, character.englishName, name, 1, 1, 1, 0, character.attackValue, character.defenceValue, character.hitRate, character.dodgeRate, character.walkSpeed, character.attackSpeed, character.hp, character.mp, character.hp, character.mp, areaId, x, y, 1];

        pinus.app.get('dbclient').query(sql, args, function(err, res) {
            if(err !== null) {
                console.error('create player failed! ' + err.message);
                console.error(err);
                invokeCallback(cb, err.message, null);
            } else {
                let player = new Player({
                    id: res.insertId,
                    userId: uid,
                    kindId: typeId,
                    kindName: role.name,
                    areaId: 1,
                    roleName: name,
                    rank: 1,
                    level: 1,
                    experience: 0,
                    attackValue: character.attackValue,
                    defenceValue: character.defenceValue,
                    skillPoint: 1,
                    hitRate: character.hitRate,
                    dodgeRate: character.dodgeRate,
                    walkSpeed: character.walkSpeed,
                    attackSpeed: character.attackSpeed,
                    equipments: {},
                    bag: null
                });
                invokeCallback(cb, null, player);
            }
        });
    }
}