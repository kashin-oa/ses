import ControlStrategy, { IActions } from '@/components/Strategy/ControlStrategy'
import * as cmd from '@/components/Graph/Commands'
import Node from '@/components/Graph/Node'
import { IGraph } from '@/components/Graph/Interfaces'
import { AddNode } from '@/components/Graph/Commands'

export default class DefaultStrategy extends ControlStrategy<IGraph> {
    protected actions: IActions = {
      graphClick: cmd.ClearSelection,
      ctrlGraphMouseDown: cmd.SetMovingMode,
      ctrlGraphMouseUp: cmd.SetSelectionMode,
      nodeMouseDown: this.selectIfNotSelected,
      nodeLeftClick: cmd.Select,
      ctrlNodeMouseDown: cmd.ToggleNodeSelection,
      shiftNodeMouseDown: cmd.ToggleNodeSelection,
      selection: cmd.Select,
      shiftSelection: cmd.ExtendSelection,
      middleDown: cmd.SetMovingMode,
      middleUp: cmd.SetSelectionMode,
      contextmenu: AddNode
    };

    selectIfNotSelected (node: Node): typeof cmd.Select | void {
      if (!node.selected) {
        return cmd.Select
      }
    }
}
