import Node from '@/components/Graph/Node'
import Link from '@/components/Graph/Link'
import { IRect, Area } from '@/components/geometry'

export type GraphEntities = Node | Link;

export interface IGraph {
    addNode(x: number, y: number): Node;
    removeNode(node: Node): void;
    pushNode(node: Node): void;
    addLink(source: Node, target: Node): Link;
    pushLink(link: Link): void;
    removeLink(link: Link): void;
    getSelection(): ISelection;
    setMode(mode: GraphMode): void;
}

export enum GraphMode {
    selection = 'selection',
    pointing = 'pointing',
    moving = 'moving'
}

export interface ISelection {
    add(data: GraphEntities | GraphEntities[]): void;
    remove(data: GraphEntities | GraphEntities[]): void;
    clear(): void;
    moveTo(x: number | null, y: number | null): void;
    moveOn(dx: number, dy: number): void;
    getNodes(): Node[];
}

export interface INodeView {
    elem: Element;
    getRect(): IRect;
}
