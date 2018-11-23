import {BTNode} from "../BTNode";
import {BTResult} from "../BTConstants";

export class BTConditional extends BTNode {
    public Tick(dt: number): BTResult {
        if (this.Check()) {
            return BTResult.Success;
        }
        else {
            return BTResult.Failed;
        }
    }

    public Check(): boolean {
        return false;
    }
}

export class BaseCondiction extends BTConditional {
    protected externalFunc : Function;
}

export class Precondition extends BaseCondiction {
    constructor(func: Function, nodeName: string) {
        super();
        this.externalFunc = func;
        this.name = nodeName;
    }

    public Check() :boolean {
        if (this.externalFunc != null) return this.externalFunc();
        else return false;
    }
}

export class PreconditionNOT extends BaseCondiction {
    constructor(func: Function, nodeName: string) {
        super();
        this.externalFunc = func;
        this.name = nodeName;
    }

    public Check(): boolean {
        if (this.externalFunc != null) return !this.externalFunc();
        else return false;
    }
}