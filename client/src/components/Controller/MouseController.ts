import Controller, { IListeners } from '@/components/Controller/Controller';

interface IKeysOptions {
  action: string;
  args: unknown[];
  event: MouseEvent;
  globalRelease?: boolean;
  globalSet?: boolean;
}

export default class MouseController extends Controller {
  protected listeners: IListeners = {
    'graph-mouse-down': this.graphMouseDown.bind(this),
    graphMouseUp: this.graphMouseUp.bind(this),
    graphClick: this.graphClick.bind(this),
    nodeLeftClick: this.nodeLeftClick.bind(this),
    nodeRightClick: this.nodeRightClick.bind(this),
    nodeDblClick: this.nodeDblClick.bind(this),
    nodeMouseDown: this.nodeMouseDown.bind(this),
    nodeMouseUp: this.nodeMouseUp.bind(this),
    graphContextmenu: this.graphContextmenu.bind(this),
    selection: this.selection.bind(this)
  };

  protected origin: [number, number] = [0, 0];
  protected shift: boolean = false;
  protected ctrl: boolean = false;

  setOrigin(element: Element): void {
    const elementRect = element.getBoundingClientRect();
    this.origin = [elementRect.left, elementRect.top];
  }

  getListeners(): IListeners {
    return this.listeners;
  }

  withKeys(options: IKeysOptions): void {
    const capitalized = options.action[0].toUpperCase() + options.action.slice(1);
    const globalSet = options.globalSet || false;
    const globalRelease = options.globalRelease || false;

    if (options.event.ctrlKey || options.event.metaKey || (globalRelease && this.ctrl)) {
      this._strategy.doAction(`ctrl${capitalized}`, ...options.args);
      if (globalRelease) {
        this.ctrl = false;
      } else if (globalSet) {
        this.ctrl = true;
      }
      return;
    }

    if (options.event.shiftKey || (globalRelease && this.shift)) {
      this._strategy.doAction(`shift${capitalized}`, ...options.args);
      if (globalRelease) {
        this.shift = false;
      } else if (globalSet) {
        this.shift = true;
      }
      return;
    }

    this._strategy.doAction(options.action, ...options.args);
  }

  nodeLeftClick(event: MouseEvent, node: unknown): void {
    this.withKeys({
      event,
      action: 'nodeLeftClick',
      args: [node],
      globalRelease: true
    });
  }

  nodeRightClick(event: MouseEvent, node: unknown): void {
    this._strategy.doAction('nodeRightClick', node);
  }

  nodeDblClick(node: unknown): void {
    this._strategy.doAction('nodeRightClick', node);
  }

  nodeMouseDown(event: MouseEvent, node: unknown): void {
    this.withKeys({
      event,
      action: 'nodeMouseDown',
      args: [node],
      globalSet: true
    });
  }

  nodeMouseUp(event: MouseEvent, node: unknown): void {
    this.withKeys({
      event,
      action: 'nodeMouseUp',
      args: [node]
    });
  }

  graphClick(event: MouseEvent): void {
    this._strategy.doAction(
      'graph-click',
      event.clientX - this.origin[0],
      event.clientY - this.origin[1]
    );
  }

  graphMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      this.withKeys({
        event,
        action: 'graphMouseDown',
        args: [event.clientX - this.origin[0], event.clientY - this.origin[1]],
        globalSet: true
      });
    } else if (event.button === 1) {
      this._strategy.doAction('middleDown');
    }
  }

  graphMouseUp(event: MouseEvent): void {
    if (event.button === 0) {
      this.withKeys({
        event,
        action: 'graphMouseUp',
        args: [event.clientX - this.origin[0], event.clientY - this.origin[1]],
        globalRelease: true
      });
    } else if (event.button === 1) {
      this._strategy.doAction('middleUp');
    }
  }

  graphContextmenu(event: MouseEvent): void {
    event.preventDefault();
    this._strategy.doAction(
      'contextmenu',
      event.clientX - this.origin[0],
      event.clientY - this.origin[1]
    );
  }

  selection(event: MouseEvent, data: unknown): void {
    if (event.shiftKey) {
      this._strategy.doAction('shiftSelection', data);
      return;
    }

    this._strategy.doAction('selection', data);
  }
}
