export enum BTResult {
    Success,
    Failed,
    Running,
}

export enum BTAbortOpt {
    None,
    Self,
    LowerPriority,
    Both,
}

export enum BTClearOpt {
    Default,
    Selected,
    DefaultAndSelected,
    All,
}

export enum BTLogic {
    And,
    Or,
}

export enum BTExecuteOpt {
    OnTick,
    OnClear,
    Both,
}

export enum BTDataReadOpt {
    ReadAtBeginning,
    ReadEveryTick,
}