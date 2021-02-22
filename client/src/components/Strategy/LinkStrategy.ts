import ControlStrategy, { IActions } from '@/components/Strategy/ControlStrategy';
import * as cmd from '@/components/Graph/Commands';
import Node from '@/components/Graph/Node';
import { IGraph } from '@/components/Graph/Interfaces';
import { AddNode } from '@/components/Graph/Commands';

export default class LinkStrategy extends ControlStrategy<IGraph> {
  protected actions: IActions = {
    'graph-click': cmd.ClearSelection,
    'ctrl-graph-mouse-down': cmd.SetMovingMode,
    'ctrl-graph-mouse-up': cmd.SetPointingMode,
    'node-mouse-down': cmd.ExtendSelection,
    'node-mouse-up': cmd.AddLinkByTarget,
    'node-left-click': this.clearSelectionAfterLink.bind(this),
    // ctrlNodeMouseDown: cmd.ToggleNodeSelection,
    // shiftNodeMouseDown: cmd.ToggleNodeSelection,
    // selection: cmd.Select,
    // shiftSelection: cmd.ExtendSelection,
    'middle-down': cmd.SetMovingMode,
    'middle-up': cmd.SetPointingMode,
    contextmenu: AddNode
  };

  init(): void {
    new cmd.SetPointingMode(this.subject).execute();
  }

  clearSelectionAfterLink(): typeof cmd.ClearSelection | void {
    if (this.subject.getSelection().getNodes().length === 2) {
      return cmd.ClearSelection;
    }
  }

  selectIfNotSelected(node: Node): typeof cmd.Select | void {
    if (!node.selected) {
      return cmd.Select;
    }
  }
}
