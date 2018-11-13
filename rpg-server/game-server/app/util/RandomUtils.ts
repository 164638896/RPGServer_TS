
export function limit(from: number, end: number): number {
    from = Math.min(from, end);
    end = Math.max(from, end);
    let range: number = end - from;
    return from + Math.random() * range;
}

export function limitInteger(from: number, end: number): number {
    return Math.round(this.limit(from, end));
}

export function randomArray(arr: Array<any>): any {
    let index: number = Math.floor(Math.random() * arr.length);
    return arr[index];
}