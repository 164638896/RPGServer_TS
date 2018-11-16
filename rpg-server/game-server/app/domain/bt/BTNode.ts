import {BTResult} from "./BTConstants";

export abstract class BTNode {
    public name: string;
    public details: string;
    public isRunning: boolean;
    public clearTick: BTNode;

    public Activate() {
        if (this.clearTick != null) {
            this.clearTick.Activate();
        }
    }

    public Tick (): BTResult {
        return BTResult.Failed;
    }

    public Clear() {
        this.isRunning = false;

        if (this.clearTick != null) {
            this.clearTick.Tick();
        }
    }
}