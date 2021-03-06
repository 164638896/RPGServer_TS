export class Vector3 {
    static ZERO = new Vector3(0.0, 0.0, 0.0);
    static ONE = new Vector3(1.0, 1.0, 1.0);
    static Up = new Vector3(0, 1, 0);

    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    scale(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    add(v: Vector3) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    sub(v: Vector3) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    normalize() {
        let len = this.lengthSquared();
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = this.x * len;
            this.y = this.y * len;
            this.z = this.z * len;
        }
    }

    cloneTo(v: Vector3) {
        v.x = this.x;
        v.y = this.y;
        v.z = this.z;
    }

    clone(): Vector3 {
        let v = new Vector3(0, 0, 0);
        this.cloneTo(v);
        return v;
    }

    // rotate (angle: number) {
    //     let x = this.x,
    //         y = this.y,
    //         cosVal = Math.cos(angle),
    //         sinVal = Math.sin(angle);
    //     this.x = x * cosVal - y * sinVal;
    //     this.y = x * sinVal + y * cosVal;
    // }
    //调试
    toString() {
        return '(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ',' + this.z.toFixed(3) + ')';
    }

    static distance(value1: Vector3, value2: Vector3): number {
        let x = value1.x - value2.x;
        let y = value1.y - value2.y;
        let z = value1.z - value2.z;
        return Math.sqrt((x * x) + (y * y) + (z * z));
    }

    static sub(value1: Vector3, value2: Vector3): Vector3 {
        let x = value1.x - value2.x;
        let y = value1.y - value2.y;
        let z = value1.z - value2.z;
        return new Vector3(x, y, z);
    }

    static add(value1: Vector3, value2: Vector3): Vector3 {
        let x = value1.x + value2.x;
        let y = value1.y + value2.y;
        let z = value1.z + value2.z;
        return new Vector3(x, y, z);
    }
}