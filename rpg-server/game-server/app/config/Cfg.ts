//本文件自动导出，不可进行修改

import { ConfigBase } from "./Configbase";

export const ALL_CONFIG_FILES = [
	"behavior_buff",
	"control_buff",
	"hurt_buff",
	"monster",
	"move_buff",
	"npc",
	"player",
	"scene",
	"skill"
];

/**
 * 配置管理类
 */
export class Cfg {
    private static _configs = {};
    
	/**
	 * 表名a
	 */
	static get behaviorBuff(): BehaviorBuffConifg {
		return this._configs["behavior_buff"] || (this._configs["behavior_buff"] = new BehaviorBuffConifg("behavior_buff"));
	}
	/**
	 * 表名a
	 */
	static get controlBuff(): ControlBuffConifg {
		return this._configs["control_buff"] || (this._configs["control_buff"] = new ControlBuffConifg("control_buff"));
	}
	/**
	 * 表名a
	 */
	static get hurtBuff(): HurtBuffConifg {
		return this._configs["hurt_buff"] || (this._configs["hurt_buff"] = new HurtBuffConifg("hurt_buff"));
	}
	/**
	 * 表名a
	 */
	static get monster(): MonsterConifg {
		return this._configs["monster"] || (this._configs["monster"] = new MonsterConifg("monster"));
	}
	/**
	 * 表名a
	 */
	static get moveBuff(): MoveBuffConifg {
		return this._configs["move_buff"] || (this._configs["move_buff"] = new MoveBuffConifg("move_buff"));
	}
	/**
	 * 表名a
	 */
	static get npc(): NpcConifg {
		return this._configs["npc"] || (this._configs["npc"] = new NpcConifg("npc"));
	}
	/**
	 * 表名a
	 */
	static get player(): PlayerConifg {
		return this._configs["player"] || (this._configs["player"] = new PlayerConifg("player"));
	}
	/**
	 * 表名a
	 */
	static get scene(): SceneConifg {
		return this._configs["scene"] || (this._configs["scene"] = new SceneConifg("scene"));
	}
	/**
	 * 表名a
	 */
	static get skill(): SkillConifg {
		return this._configs["skill"] || (this._configs["skill"] = new SkillConifg("skill"));
	}
}


export class BehaviorBuffConifg extends ConfigBase {
	getData(id: number): BehaviorBuffCfg {
		this.init();
		return this._obj[id];
	}
}
export class ControlBuffConifg extends ConfigBase {
	getData(id: number): ControlBuffCfg {
		this.init();
		return this._obj[id];
	}
}
export class HurtBuffConifg extends ConfigBase {
	getData(id: number): HurtBuffCfg {
		this.init();
		return this._obj[id];
	}
}
export class MonsterConifg extends ConfigBase {
	getData(id: number): MonsterCfg {
		this.init();
		return this._obj[id];
	}
}
export class MoveBuffConifg extends ConfigBase {
	getData(id: number): MoveBuffCfg {
		this.init();
		return this._obj[id];
	}
}
export class NpcConifg extends ConfigBase {
	getData(id: number): NpcCfg {
		this.init();
		return this._obj[id];
	}
}
export class PlayerConifg extends ConfigBase {
	getData(id: number): PlayerCfg {
		this.init();
		return this._obj[id];
	}
}
export class SceneConifg extends ConfigBase {
	getData(id: number): SceneCfg {
		this.init();
		return this._obj[id];
	}
}
export class SkillConifg extends ConfigBase {
	getData(id: number): SkillCfg {
		this.init();
		return this._obj[id];
	}
}