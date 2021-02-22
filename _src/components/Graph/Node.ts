import Link from './Link'
import { IRect } from '@/components/geometry'
import { INodeView } from './Interfaces'

export default class Node {
    id = 0;
    x = 0;
    y = 0;
    fx: number | null = null;
    fy: number | null = null;
    r = 15;
    fill = 'white';
    stroke = 'black';
    strokeWidth = 3;
    selected = false;
    links: Set<Link> = new Set();
    view: INodeView | null = null;

    constructor (id: number, x = 0, y = 0) {
      this.id = id
      this.x = x
      this.y = y
    }

    setLink (link: Link): void {
      this.links.add(link)
    }

    removeLink (link: Link): void {
      this.links.delete(link)
    }

    hasLink (link: Link): boolean {
      return this.links.has(link)
    }

    select (): void {
      this.selected = true
    }

    deselect (): void {
      this.selected = false
    }

    moveTo (x: number | null, y: number | null): void {
      this.fx = x
      this.fy = y
    }

    moveOn (dx: number, dy: number): void {
      this.fx = (this.fx || this.x) + dx
      this.fy = (this.fy || this.y) + dy
    }

    getRect (): IRect {
      // const x = this.fx || this.x;
      // const y = this.fy || this.y;
      // const diameter = this.r * 2;
      //
      // return {
      //     x: x - this.r,
      //     y: y - this.r,
      //     width: diameter,
      //     height: diameter
      // };
      return this.view
        ? this.view.getRect()
        : { x: 0, y: 0, width: 0, height: 0 }
    }
}
