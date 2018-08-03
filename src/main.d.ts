declare interface Store<TState> {
  subscribe (subscriberFunction: (state: TState) => void): (() => void) | undefined
  updateState (updaterFn: (draftState: TState) => TState): void
  getState (): TState
}

export = class $tate {
  static createStore<TState> (initialState: TState, persistenceKey: string, isDebug = false): Store<TState>
}