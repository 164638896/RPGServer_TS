import {BTNode} from "../BTNode";
import {BTResult} from "../BTConstants";
import {RandomUtils} from "../../../util/RandomUtils";

enum BTActionStatus {
    Ready,
    Running,
}

export class BTAction extends BTNode {
    private _status: BTActionStatus = BTActionStatus.Ready;

    public Tick(dt: number): BTResult {
        let tickResult: BTResult = BTResult.Success;

        if (this._status == BTActionStatus.Ready) {
            this.Enter();
            this._status = BTActionStatus.Running;
        }

        if (this._status == BTActionStatus.Running) {
            tickResult = this.Execute(dt);
            if (tickResult != BTResult.Running) {
                this.Exit();
                this._status = BTActionStatus.Ready;
                this.isRunning = false;
            }
            else {
                this.isRunning = true;
            }
        }
        return tickResult;
    }

    public Clear() {
        super.Clear();

        if (this._status != BTActionStatus.Ready) {	// not cleared yet
            this.Exit();
            this._status = BTActionStatus.Ready;
        }
    }

    protected Enter() {

    }

    protected Execute(dt: number) {
        return BTResult.Failed;
    }


    protected Exit() {

    }
}

export class BTActionWait extends BTAction {
    private mStartTime: number;
    public mMilliseconds: number;

    constructor(milliseconds: number) {
        super();
        this.mMilliseconds = milliseconds;
    }

    protected Enter() {
        super.Enter();

        this.mStartTime = Date.now();
    }

    protected Execute(): BTResult {
        if (Date.now() - this.mStartTime >= this.mMilliseconds) {
            return BTResult.Success;
        }
        return BTResult.Running;
    }
}

export class BTActionWaitRandom extends BTAction {
    private mStartTime: number;
    private mInterval: number;

    public mMillisecondsMin: number;
    public mMillisecondsMax: number;

    constructor(millisecondsMin: number, millisecondsMax: number) {
        super();
        this.mMillisecondsMin = millisecondsMin;
        this.mMillisecondsMax = millisecondsMax;
    }

    protected Enter() {
        super.Enter();

        this.mStartTime = Date.now();
        this.mInterval = RandomUtils.range(this.mMillisecondsMin, this.mMillisecondsMax);
    }

    protected Execute(): BTResult {
        if (Date.now() - this.mStartTime >= this.mInterval) {
            return BTResult.Success;
        }
        return BTResult.Running;
    }
}