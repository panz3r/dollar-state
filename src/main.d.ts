declare interface Store<TState> {
  subscribe(subscriberFunction: (state: TState) => void): (() => void) | undefined;
  updateState(updaterFn: (draftState: TState) => TState, actionName?: string): void;
  getState(): TState;
  resetState(): void;
}

declare interface TStateOptions {
  persistenceKey?: string;
  isDebug?: boolean;
}

declare class $tate {
  static createStore<TState>(initialState?: TState, options?: TStateOptions): Store<TState>;
}

export = $tate;
