import {BTClearOpt} from "../BTConstants";
import {BTNode} from "../BTNode";

export class BTComposite extends BTNode {

    protected _children = new Array<BTNode>();
    protected _selectedChildrenForClear = new Array<BTNode>();

    public clearOpt: BTClearOpt;

    public Activate() {
        super.Activate();

        for(let i in this._children) {
            this._children[i].Activate();
        }
    }

    public AddChild(node: BTNode, selectForClear: boolean = false) {
        if (node != null) {
            this._children.push(node);
        }

        if (selectForClear) {
            this._selectedChildrenForClear.push(node);
        }
    }

    public RemoveChild(node: BTNode) {
        let index = this._children.indexOf(node);
        this._children.splice(index,1);

        let index1 = this._selectedChildrenForClear.indexOf(node);
        this._selectedChildrenForClear.splice(index1,1);
    }
}