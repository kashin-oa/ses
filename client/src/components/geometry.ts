export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type Point = [number, number];
export type Area = [Point, Point];

export class Rect implements IRect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x?: number, y?: number, width?: number, height?: number){
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    static isInArea(rect: IRect, area: Area): boolean {
        return rect.x > area[0][0] &&
            rect.y > area[0][1] &&
            rect.x + rect.width < area[1][0] &&
            rect.y + rect.height < area[1][1];
    }

    // static fromArea(area: [Point, Point]): IRect {
    //     return new Rect(
    //         area[0][0], area[0][1],
    //         area[1][0] - area[0][0],
    //         area[1][1] - area[0][1]
    //     );
    // }
}


