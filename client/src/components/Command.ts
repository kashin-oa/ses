export interface ICommand {
    execute(...args: Array<any>): boolean;
    undo(): void;
}

export interface ExtendedCommand {
    new (...args: any[]): ICommand;
    prototype: Command<any, any>;
}

export default abstract class Command<Entity, Backup = null> implements ICommand {
    protected entity: Entity;
    protected backupData!: Backup;

    constructor(entity: Entity) {
        this.entity = entity;
    }

    abstract execute(...args: any): boolean;
    undo(): void {
        return;
    };

    protected backup(...args: any): void {
        return;
    };
}
