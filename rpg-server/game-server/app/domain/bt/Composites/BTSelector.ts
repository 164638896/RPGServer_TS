import {BTComposite} from "./BTComposite";
import {BTClearOpt, BTResult} from "../BTConstants";
import {BTNode} from "../BTNode";

export class BTSelector extends BTComposite {
    public _activeChildIndex: number = -1;
    public _previousSuccessChildIndex: number = -1;

    public Tick (): BTResult {
        for (let i=0; i<this._children.length; i++) {
            let child: BTNode = this._children[i];

            switch (child.Tick()) {
                case BTResult.Running:
                    if (this._activeChildIndex != i && this._activeChildIndex != -1) {
                        this._children[this._activeChildIndex].Clear();
                    }
                    this._activeChildIndex = i;
                    this._previousSuccessChildIndex = -1;
                    this.isRunning = true;
                    return BTResult.Running;

                case BTResult.Success:
                    if (this._activeChildIndex != i && this._activeChildIndex != -1) {
                        this._children[this._activeChildIndex].Clear();
                    }
                    child.Clear();
                    this._activeChildIndex = -1;
                    this._previousSuccessChildIndex = i;
                    this.isRunning = false;
                    return BTResult.Success;

                case BTResult.Failed:
                    child.Clear();
                    continue;
            }
        }

        this._activeChildIndex = -1;
        this._previousSuccessChildIndex = -1;
        this.isRunning = false;
        return BTResult.Failed;
    }

    public  Clear () {
        super.Clear();

        switch (this.clearOpt) {
            case BTClearOpt.Default:
                if (this._activeChildIndex != -1) {
                    this._children[this._activeChildIndex].Clear();
                }
                break;

            case BTClearOpt.Selected:
                for(let i in this._selectedChildrenForClear) {
                    let child = this._selectedChildrenForClear[i];
                    let index: number = this._children.indexOf(child);
                    if(index > this._previousSuccessChildIndex){
                        child.Clear();
                    }
                }

                break;

            case BTClearOpt.DefaultAndSelected:
                if (this._activeChildIndex != -1) {
                    let activeChild: BTNode = this._children[this._activeChildIndex];
                    if (this._selectedChildrenForClear.indexOf(activeChild) < 0) {
                        activeChild.Clear();
                    }
                }

                let split1: number = Math.max(this._activeChildIndex, this._previousSuccessChildIndex);
                for(let i in this._selectedChildrenForClear){
                    let child = this._selectedChildrenForClear[i];
                    let index: number = this._children.indexOf(child);
                    if (index > split1) {
                        child.Clear();
                    }
                }

                break;

            case BTClearOpt.All:
                let split2: number = Math.max(this._activeChildIndex-1, this._previousSuccessChildIndex);
                for(let i in this._children) {
                    let child = this._children[i];
                    let index: number = this._children.indexOf(child);
                    if (index > split2) {
                        child.Clear();
                    }
                }

                break;
        }

        this._activeChildIndex = -1;
        this._previousSuccessChildIndex = -1;
    }
}