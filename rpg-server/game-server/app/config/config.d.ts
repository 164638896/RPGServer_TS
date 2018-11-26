/**
 * 表名a
 */
declare class BehaviorBuffCfg {
	/** 类型Id */
	id: number;
	/** Buff名 */
	name: string;
	/** 持续时间 */
	duration: number;
	/** 能否移动 */
	can_move: number;
	/** 能否攻击 */
	can_atk: number;
}

/**
 * 表名a
 */
declare class ControlBuffCfg {
	/** 类型Id */
	id: number;
	/** Buff名 */
	name: string;
	/** 持续时间 */
	duration: number;
	/** 清除buff */
	clear_buff: number;
	/** 行为buff开关 */
	enableb_ehavior: number;
	/** 能否移动buff开关 */
	enable_move: number;
	/** 伤害buff开关 */
	enable_hurt: number;
	/** 能否选中Buff开关 */
	enable_select: number;
}

/**
 * 表名a
 */
declare class HurtBuffCfg {
	/** 类型Id */
	id: number;
	/** Buff名 */
	name: string;
	/** 持续时间 */
	duration: number;
	/** 播放伤害动作 */
	ani: string;
}

/**
 * 表名a
 */
declare class MonsterCfg {
	/** 类型ID */
	id: number;
	/** 资源 */
	res: string;
	/** 血 */
	hp: number;
	/** 攻击力 */
	atk: number;
	/** 防御力 */
	def: number;
	/** 速度 */
	speed: number;
	/** 技能 */
	skill: number[];
}

/**
 * 表名a
 */
declare class MoveBuffCfg {
	/** 类型Id */
	id: number;
	/** Buff名 */
	name: string;
	/** 持续时间 */
	duration: number;
	/** 移动方向 */
	dir: number;
	/** 释放距离 */
	distance: number;
}

/**
 * 表名a
 */
declare class NpcCfg {
	/** 类型ID */
	id: number;
	/** 资源 */
	res: string;
	/** 血 */
	hp: number;
	/** 攻击力 */
	atk: number;
	/** 防御力 */
	def: number;
	/** 速度 */
	speed: number;
	/** 技能 */
	skill: number[];
}

/**
 * 表名a
 */
declare class PlayerCfg {
	/** 类型ID */
	id: number;
	/** 资源 */
	res: string;
	/** 血 */
	hp: number;
	/** 攻击力 */
	atk: number;
	/** 防御力 */
	def: number;
	/** 速度 */
	speed: number;
	/** 技能 */
	skill: number[];
}

/**
 * 表名a
 */
declare class SceneCfg {
	/** 类型ID */
	id: number;
	/** 资源名 */
	res: string;
	/** 资源名 */
	asynres: string[];
}

/**
 * 表名a
 */
declare class SkillCfg {
	/** 类型Id */
	id: number;
	/** 技能名 */
	name: string;
	/** 动作名 */
	ani: string;
	/** 自身位置特效 */
	self_effect: string;
	/** 目标位置特效 */
	target_effect: string;
	/** 释放技能距离 */
	dis: number;
	/** 行为类型buff */
	behavior_buff: string;
	/** 位移类型buff */
	move_buff: string;
	/** 伤害类型buff */
	hurt_buff: string;
	/** 控制buff能否生效buff */
	constrol_buff: string;
}

