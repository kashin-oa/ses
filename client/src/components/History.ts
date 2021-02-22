import Command, { ICommand } from '@/components/Command';

export default class History {
  protected history: Array<ICommand> = [];

  push(command: ICommand): void {
    this.history.push(command);
  }

  pop(): ICommand | null {
    return this.history.pop() || null;
  }
}
