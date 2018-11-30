export class Vector2 {
    static ZERO = new Vector2(0.0, 0.0);
    static ONE = new Vector2(1.0, 1.0);

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    scale(s: number) {
        this.x *= s;
        this.y *= s;
    }

    add(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v: Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        let len = this.lengthSquared();
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = this.x * len;
            this.y = this.y * len;
        }
    }

    rotate(angle: number) {
        let x = this.x,
            y = this.y,
            cosVal = Math.cos(angle),
            sinVal = Math.sin(angle);
        this.x = x * cosVal - y * sinVal;
        this.y = x * sinVal + y * cosVal;
    }

    //调试
    toString() {
        return '(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ')';
    }
}