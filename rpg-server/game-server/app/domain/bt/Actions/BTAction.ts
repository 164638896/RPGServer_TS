import {BTNode} from "../BTNode";
import {BTResult} from "../BTConstants";
import * as RandomUtils from "../../../util/RandomUtils";

enum BTActionStatus {
    Ready,
    Running,
}

export class BTAction extends BTNode {
    private _status: BTActionStatus = BTActionStatus.Ready;

    public  Tick (): BTResult {
        let tickResult:BTResult = BTResult.Success;

        if (this._status == BTActionStatus.Ready) {
            this.Enter();
            this._status = BTActionStatus.Running;
        }

        if (this._status == BTActionStatus.Running) {
            tickResult = this.Execute();
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

    public  Clear () {
        super.Clear();

        if (this._status != BTActionStatus.Ready) {	// not cleared yet
            this.Exit();
            this._status = BTActionStatus.Ready;
        }
    }

    protected Enter () {

    }

    protected Execute () {return BTResult.Failed;}


    protected Exit () {

    }
}

export class BTActionWait extends BTAction {
    private mStartTime: number;
    public mMilliseconds: number;

    constructor (milliseconds: number) {
        super();
        this.mMilliseconds = milliseconds;
    }

    protected  Enter () {
        super.Enter ();

        this.mStartTime = Date.now();
    }

    protected  Execute (): BTResult {
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

    constructor (millisecondsMin: number, millisecondsMax: number) {
        super();
        this.mMillisecondsMin = millisecondsMin;
        this.mMillisecondsMax = millisecondsMax;
    }

    protected Enter () {
        super.Enter ();

        this.mStartTime = Date.now();
        this.mInterval = RandomUtils.limit(this.mMillisecondsMin, this.mMillisecondsMax);
    }

    protected Execute (): BTResult {
        if (Date.now() - this.mStartTime >= this.mInterval) {
            return BTResult.Success;
        }
        return BTResult.Running;
    }
}