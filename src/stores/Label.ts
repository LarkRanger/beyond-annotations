import { DEFAULT_LABEL_COLOR } from 'consts';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

export class Label {
  readonly id: string;
  private _name: string;
  private _color: string;

  constructor(name: string, color?: string) {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.id = nanoid();
    this._name = name;
    this._color = color ?? DEFAULT_LABEL_COLOR;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get color() {
    return this._color;
  }

  set color(color: string) {
    this._color = color;
  }
}
