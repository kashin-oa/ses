import { IStrategy } from '@/components/Strategy/ControlStrategy';

export interface IListeners {
    [name: string]: Function;
}

export default abstract class Controller {
    protected _strategy: IStrategy;

    constructor(strategy: IStrategy) {
        this._strategy = strategy;
    }

    setStrategy(strategy: IStrategy): void {
        this._strategy = strategy;
    }

    abstract getListeners(): IListeners;
}
