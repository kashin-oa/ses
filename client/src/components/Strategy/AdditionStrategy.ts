import ControlStrategy, { IActions } from '@/components/Strategy/ControlStrategy';
import { AddNode } from '@/components/Graph/Commands';
import { IGraph } from '@/components/Graph/Interfaces';

export default class AdditionStrategy extends ControlStrategy<IGraph> {
    protected actions: IActions = {
        graphClick: AddNode,
        contextmenu: this.undo
    };
}
