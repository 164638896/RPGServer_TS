export class RandomUtils {

    static range(from: number, end: number): number {
        from = Math.min(from, end);
        end = Math.max(from, end);
        let range: number = end - from;
        return from + Math.random() * range;
    }

    static rangeInteger(from: number, end: number): number {
        return Math.round(this.range(from, end));
    }

    static randomArray(arr: Array<any>): any {
        let index: number = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
}