import {BTComposite} from "./BTComposite";
import {BTClearOpt, BTResult} from "../BTConstants";
import {BTNode} from "../BTNode";

export class BTSimpleParallel extends BTComposite {
    private _primaryChild : BTNode;
    private _runningChildren = new Array<BTNode>();
    private _shouldClearPrimaryChild: boolean = true;

    public SetPrimaryChild (node:BTNode, selectForClear:boolean = false) {
        if (this._primaryChild != null) {
            //selectedChildrenForClear.Remove(this._primaryChild);
            let index = this._selectedChildrenForClear.indexOf(this._primaryChild);
            this._selectedChildrenForClear.splice(index, 1);
        }

        this._primaryChild = node;
        if (selectForClear) {
            //selectedChildrenForClear.Add(this._primaryChild);
            this._selectedChildrenForClear.push(this._primaryChild);
        }
    }

    public Activate() {
        super.Activate ();

        this._primaryChild.Activate();
        this.ResetRuningChildren();
    }

    public Tick(): BTResult {
        if (this._primaryChild == null) {
            console.error("Primary Child not set!");
        }

        let primaryChildResult: BTResult = this._primaryChild.Tick();

        if (primaryChildResult == BTResult.Running) {
            this.RunBackground();
            this.isRunning = true;
            return BTResult.Running;
        }
        else {
            this._shouldClearPrimaryChild = false;
            this._primaryChild.Clear();
            this.isRunning = false;
            return primaryChildResult;
        }
    }

    public Clear() {
        super.Clear();

        switch (this.clearOpt) {
            case BTClearOpt.Default:
            case BTClearOpt.DefaultAndSelected:
            case BTClearOpt.All:
                if (this._shouldClearPrimaryChild) {
                    this._primaryChild.Clear();
                }
                for(let i in this._runningChildren) {
                    let child: BTNode = this._runningChildren[i];
                    child.Clear();
                }

                break;

            case BTClearOpt.Selected:

                for(let i in this._selectedChildrenForClear) {
                    let child: BTNode = this._selectedChildrenForClear[i];
                    if ((this._shouldClearPrimaryChild && child == this._primaryChild) || this._runningChildren.indexOf(child) >= 0) {
                        child.Clear();
                    }
                }

                break;
        }

        this._shouldClearPrimaryChild = true;
        this.ResetRuningChildren();
    }

    private ResetRuningChildren() {
        this._runningChildren = new Array<BTNode>();
        for(let i in this._children) {
            let child = this._children[i];
            this._runningChildren.push(child);
        }

    }

    private RunBackground() {
        for(let i = this._runningChildren.length - 1; i >= 0; --i) {
            let child : BTNode= this._runningChildren[i];
            let result: BTResult = child.Tick();

            if (result != BTResult.Running) {
                child.Clear();
                this._runningChildren.splice(i, 1);
            }
        }
    }
}