declare interface Store<TState> {
  subscribe (subscriberFunction: (state: TState) => void): (() => void) | undefined
  updateState (updaterFn: (draftState: TState) => TState): void
  getState (): TState
}

declare class $tate {
  static createStore<TState> (initialState: TState, persistenceKey: string, isDebug?: boolean): Store<TState>
}

export = $tate
