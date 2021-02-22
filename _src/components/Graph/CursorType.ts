enum Cursor {
    crosshair = 'crosshair',
    move = 'move',
    pointer = 'pointer',
    default = 'default'
}

export interface IElementsCursors {
    selection: Cursor;
    node: Cursor;
}

export default class CursorType {
    static onSelection: IElementsCursors = {
      selection: Cursor.crosshair,
      node: Cursor.crosshair
    };

    static onDrag: IElementsCursors = {
      selection: Cursor.default,
      node: Cursor.default
    };

    static pointing: IElementsCursors = {
      selection: Cursor.crosshair,
      node: Cursor.pointer
    };

    static moving: IElementsCursors = {
      selection: Cursor.crosshair,
      node: Cursor.move
    };

    static selection: IElementsCursors = CursorType.moving;
}
