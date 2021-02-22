export interface ICommand {
  execute(...args: Array<any>): boolean;
  undo(): void;
}

export default abstract class Command<Entity, Backup = null> implements ICommand {
  protected entity: Entity;
  protected backupData!: Backup;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  abstract execute(...args: any): boolean;

  undo(): void { }

  protected backup(...args: any): void { }
}

export interface ExtendedCommand {
  new(...args: any[]): ICommand;
  prototype: Command<any, any>;
}
