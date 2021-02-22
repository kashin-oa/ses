import Node from './Node';
import { IRect } from '@/components/geometry';

export default class Link {
  id: number = 0;
  source!: Node;
  target!: Node;
  stroke: string = 'black';
  strokeWidth: number = 3;
  selected: boolean = false;

  constructor(id: number, source: Node, target: Node) {
    this.id = id;
    this.source = source;
    this.target = target;
  }

  clearTermination(): void {
    this.target.removeLink(this);
    this.source.removeLink(this);
  }

  select(): void {
    this.selected = true;
  }

  deselect(): void {
    this.selected = false;
  }

  getRect(): IRect {
    const sourceCoord = [this.source.fx || this.source.x, this.source.fy || this.source.y];
    const targetCoord = [this.target.fx || this.target.x, this.target.fy || this.target.y];
    const minX = Math.min(sourceCoord[0], targetCoord[0]);
    const minY = Math.min(sourceCoord[1], targetCoord[1]);
    const maxX = Math.max(sourceCoord[0], targetCoord[0]);
    const maxY = Math.max(sourceCoord[1], targetCoord[1]);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}
