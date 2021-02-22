import Command from '@/components/Command';
import { GraphMode, IGraph } from '@/components/Graph/Interfaces';
import Node from '@/components/Graph/Node';
import Link from '@/components/Graph/Link';

type Entities = Node | Link;

export class AddNode extends Command<IGraph, Node> {
  execute(x: number, y: number): boolean {
    const node = this.entity.addNode(x, y);
    this.backup(node);
    return true;
  }

  backup(node: Node): void {
    this.backupData = node;
  }

  undo(): void {
    this.entity.removeNode(this.backupData);
  }
}

export class RemoveNode extends Command<IGraph, null> {
  node!: Node;
  links: Array<Link> = [];

  execute(node: Node): boolean {
    this.backup(node);
    this.entity.removeNode(node);
    return true;
  }

  undo(): void {
    this.entity.pushNode(this.node);
    this.links.forEach((link: Link) => this.entity.pushLink(link));
  }

  backup(node: Node): void {
    this.node = node;
    node.links.forEach((link: Link) => this.links.push(link));
  }
}

export class AddLink extends Command<IGraph, Link> {
  execute(source: Node, target: Node): boolean {
    const link = this.entity.addLink(source, target);
    this.backup(link);
    return true;
  }

  undo(): void {
    this.entity.removeLink(this.backupData);
  }

  backup(link: Link): void {
    this.backupData = link;
  }
}

export class AddLinkByTarget extends AddLink {
  execute(target: Node): boolean {
    const selectedNodes = this.entity.getSelection().getNodes();

    if (selectedNodes.length !== 2) {
      return false;
    }

    const sourceIndex = selectedNodes[0] === target ? 1 : 0;
    return super.execute(selectedNodes[sourceIndex], target);
  }
}

export class RemoveLink extends Command<IGraph, Link> {
  execute(link: Link): boolean {
    this.entity.removeLink(link);
    this.backup(link);
    return true;
  }

  backup(link: Link): void {
    this.backupData = link;
  }

  undo(): void {
    this.entity.pushLink(this.backupData);
  }
}

export class Select extends Command<IGraph> {
  execute(data: Entities | Entities[]): boolean {
    const selection = this.entity.getSelection();
    selection.clear();
    selection.add(data);
    return false;
  }
}

export class ExtendSelection extends Command<IGraph> {
  execute(data: Entities | Entities[]): boolean {
    this.entity.getSelection().add(data);
    return false;
  }
}

export class ReduceSelection extends Command<IGraph> {
  execute(data: Entities | Entities[]): boolean {
    this.entity.getSelection().remove(data);
    return false;
  }
}

export class ClearSelection extends Command<IGraph> {
  execute(): boolean {
    this.entity.getSelection().clear();
    return false;
  }
}

export class ToggleNodeSelection extends Command<IGraph> {
  execute(node: Entities): boolean {
    const selection = this.entity.getSelection();
    if (node.selected) {
      selection.remove(node);
    } else {
      selection.add(node);
    }
    return false;
  }
}

export class SetSelectionMode extends Command<IGraph> {
  execute(): boolean {
    this.entity.setMode(GraphMode.selection);
    return false;
  }
}

export class SetMovingMode extends Command<IGraph> {
  execute(): boolean {
    this.entity.setMode(GraphMode.moving);
    return false;
  }
}

export class SetPointingMode extends Command<IGraph> {
  execute(): boolean {
    this.entity.setMode(GraphMode.pointing);
    return false;
  }
}
