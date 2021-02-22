import ControlStrategy, { IActions } from '@/components/Strategy/ControlStrategy';
import * as cmd from '@/components/Graph/Commands';
import Node from '@/components/Graph/Node';
import { IGraph } from '@/components/Graph/Interfaces';
import { AddNode } from '@/components/Graph/Commands';

export default class DefaultStrategy extends ControlStrategy<IGraph> {
  protected actions: IActions = {
    'graph-click': cmd.ClearSelection,
    'ctrl-graph-mouse-down': cmd.SetMovingMode,
    'ctrl-graph-mouse-up': cmd.SetSelectionMode,
    'node-mouse-down': this.selectIfNotSelected,
    'node-left-click': cmd.Select,
    'ctrl-node-mouse-down': cmd.ToggleNodeSelection,
    'shift-node-mouse-down': cmd.ToggleNodeSelection,
    'selection': cmd.Select,
    'shift-selection': cmd.ExtendSelection,
    'middle-down': cmd.SetMovingMode,
    'middle-up': cmd.SetSelectionMode,
    contextmenu: AddNode
  };

  selectIfNotSelected(node: Node): typeof cmd.Select | void {
    if (!node.selected) {
      return cmd.Select;
    }
  }
}
