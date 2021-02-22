import Command, { ICommand, ExtendedCommand } from '@/components/Command';
import History from '@/components/History';

type CommandEntity = ExtendedCommand | ((...args: any[]) => ExtendedCommand | void);

export interface IActions {
  [actionName: string]: CommandEntity;
}

export interface IStrategy {
  doAction(...args: any[]): void;
  init(): void;
}

class Undo extends Command<History, null> {
  history!: History;
  needHistory: boolean = true;

  execute(): boolean {
    const command = this.history.pop();

    if (command) {
      command.undo();
    }

    return false;
  }

  undo(): void { }

  protected backup(): void { }
}

export default class ControlStrategy<Subject> {
  protected actions: IActions = {};
  protected history: History;
  protected subject: Subject;
  protected undo: ExtendedCommand = Undo;
  protected undoAction: string = '';

  constructor(subject: Subject, history: History) {
    this.history = history;
    this.subject = subject;
  }

  init(): void { }

  doAction(actionName: string, ...args: Array<any>): void {
    if (!this.actions[actionName]) {
      return;
    }

    const commandEntity = this.actions[actionName];
    const CommandConstructor = this.isCommandConstructor(commandEntity)
      ? commandEntity
      : commandEntity(...args);

    if (!CommandConstructor) {
      return;
    }

    const command = new CommandConstructor(this.subject);

    if (this.isUndoCommand(command)) {
      command.history = this.history;
    }

    const canSave = command.execute(...args);

    if (canSave) {
      this.history.push(command);
    }
  }

  protected isCommandConstructor(cmdEntity: CommandEntity): cmdEntity is ExtendedCommand {
    // @ts-ignore: temporary
    return Command.isPrototypeOf(cmdEntity);
  }

  protected isUndoCommand(command: ICommand): command is Undo {
    return (command as Undo).needHistory;
  }
}
