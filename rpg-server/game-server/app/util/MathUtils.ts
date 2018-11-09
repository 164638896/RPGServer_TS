

//c原点, u 方向, r半径, theta角度, p点是否在扇形里
export function  IsPointInCircularSector(cx: number, cy: number, ux: number, uy: number, r: number, theta: number, px: number, py: number): boolean {
    if (r <= 0 || theta <= 0 || theta > Math.PI) {
        console.log("IsPointInCircularSector 参数错误 r=", r, " theta=", theta);
        return false;
    }
    // D = P - C
    let dx = px - cx;
    let dy = py - cy;

    // |D| = (dx^2 + dy^2)^0.5
    let length = Math.sqrt(dx * dx + dy * dy);

    // |D| > r
    if (length > r)
        return false;

    // Normalize D
    dx /= length;
    dy /= length;

    // acos(D dot U) < theta
    let th: number = Math.acos(dx * ux + dy * uy);
    return th < theta;
}

//弧度制转换为角度值
export function  getAngle(radian: number): number {
    return 180 * radian / Math.PI;
}

//角度值转换为弧度制
export function  getRadian(angle: number): number {
    return angle / 180 * Math.PI;
}
