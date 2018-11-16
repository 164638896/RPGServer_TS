import {BTComposite} from "./BTComposite";
import {BTClearOpt, BTResult} from "../BTConstants";
import {BTNode} from "../BTNode";

export class BTSequence extends BTComposite {
    private _activeChildIndex: number;

    public Tick(): BTResult {
        return this.TickFromActiveChild();
    }

    public Clear() {
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
                    let index = this._children.indexOf(child);
                    if(index >= this._activeChildIndex) {
                        child.Clear();
                    }
                }

                break;

            case BTClearOpt.DefaultAndSelected:
                if (this._activeChildIndex != -1) {
                    let activeChild: BTNode = this._children[this._activeChildIndex];
                    if(this._selectedChildrenForClear.indexOf(activeChild) < 0) {
                        activeChild.Clear();
                    }
                }

                for(let i in this._selectedChildrenForClear) {
                    let child = this._selectedChildrenForClear[i];
                    let index = this._children.indexOf(child);
                    if (index >= this._activeChildIndex) {
                        child.Clear();
                    }
                }

                break;

            case BTClearOpt.All:
                if (this._activeChildIndex > -1) {
                    for (let i = this._activeChildIndex; i < this._children.length; ++i) {
                        if (i < 0) continue;
                        this._children[i].Clear();
                    }
                }
                break;
        }

        this._activeChildIndex = -1;
    }

    private TickFromActiveChild(): BTResult {
        if (this._activeChildIndex == -1) {
            this._activeChildIndex = 0;
        }

        for (; this._activeChildIndex < this._children.length; this._activeChildIndex++) {
            let activeChild: BTNode = this._children[this._activeChildIndex];

            switch (activeChild.Tick()) {
                case BTResult.Running:
                    this.isRunning = true;
                    return BTResult.Running;
                case BTResult.Success:
                    activeChild.Clear();
                    continue;
                case BTResult.Failed:
                    activeChild.Clear();
                    this._activeChildIndex = -1;
                    this.isRunning = false;
                    return BTResult.Failed;
            }
        }

        this._activeChildIndex = -1;
        this.isRunning = false;
        return BTResult.Success;
    }
}