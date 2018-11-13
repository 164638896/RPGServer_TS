export class RES_CODE {
    static SUC_OK: number = 1; // success
    static ERR_FAIL: number = -1; // Failded without specific reason
    static ERR_USER_NOT_LOGINED: number = -2; // User not login
    static ERR_CHANNEL_DESTROYED: number = -10; // channel has been destroyed
    static ERR_SESSION_NOT_EXIST: number = -11; // session not exist
    static ERR_CHANNEL_DUPLICATE: number = -12; // channel duplicated
    static ERR_CHANNEL_NOT_EXIST: number = -13; // channel not exist
}

export class MESSAGE {
    static RES: number = 200;
    static ERR: number = 500;
    static PUSH: number = 600;
}

export enum EntityType {
    None = 0,
    Player,
    Monster,
    Npc,

    // static null: string ='';
    // static PLAYER: string = 'player';
    // static NPC: string = 'npc';
    // static MONSTER: string = 'monster';
    // static ITEM: string = 'item';
}