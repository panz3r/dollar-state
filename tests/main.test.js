import $tate from '../src/main';

describe('module', () => {
  it('should expose a createStore function', () => {
    expect($tate.createStore).toBeDefined();
    expect($tate.createStore).toBeInstanceOf(Function);
  });

  it('should create an empty store', () => {
    const store = $tate.createStore();
    expect(store).toBeDefined();
    expect(store.getState()).toStrictEqual({});
  });

  it('should create an initialized store', () => {
    const store = $tate.createStore({ a: 1 });
    expect(store).toBeDefined();
    expect(store.getState()).toStrictEqual({ a: 1 });
  });
});

describe('logger', () => {
  it('should be defined', () => {
    expect($tate._logStateUpdate).toBeDefined();
    expect($tate._logStateUpdate).toBeInstanceOf(Function);
  });

  it('should log action as console.group', () => {
    const consoleGroupSpy = jest
      .spyOn(global.console, 'group')
      .mockImplementation();
    const consoleLogSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(global.console, 'groupEnd')
      .mockImplementation();

    const storeName = 'testStore';
    const actionName = 'testAction';

    $tate._logStateUpdate(storeName, actionName, {}, {});

    expect(consoleGroupSpy).toHaveBeenCalledTimes(1);
    expect(consoleGroupSpy).toHaveBeenCalledWith(storeName);

    expect(consoleLogSpy).toHaveBeenCalledTimes(3);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'oldState:', {});
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'action:', actionName);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'newState:', {});

    expect(consoleGroupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('should log action as console.group - without actionName', () => {
    const consoleGroupSpy = jest
      .spyOn(global.console, 'group')
      .mockImplementation();
    const consoleLogSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(global.console, 'groupEnd')
      .mockImplementation();

    const storeName = 'testStore';

    $tate._logStateUpdate(storeName, undefined, {}, {});

    expect(consoleGroupSpy).toHaveBeenCalledTimes(1);
    expect(consoleGroupSpy).toHaveBeenCalledWith(storeName);

    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'oldState:', {});
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'newState:', {});

    expect(consoleGroupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('should log action as console.group - without storeName', () => {
    const consoleGroupSpy = jest
      .spyOn(global.console, 'group')
      .mockImplementation();
    const consoleLogSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(global.console, 'groupEnd')
      .mockImplementation();

    const actionName = 'testAction';

    $tate._logStateUpdate(undefined, actionName, {}, {});

    expect(consoleGroupSpy).toHaveBeenCalledTimes(1);
    expect(consoleGroupSpy).toHaveBeenCalledWith('not-persisted');

    expect(consoleLogSpy).toHaveBeenCalledTimes(3);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'oldState:', {});
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'action:', actionName);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'newState:', {});

    expect(consoleGroupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('should log action as console.group - without storeName and actionName', () => {
    const consoleGroupSpy = jest
      .spyOn(global.console, 'group')
      .mockImplementation();
    const consoleLogSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(global.console, 'groupEnd')
      .mockImplementation();

    $tate._logStateUpdate(undefined, undefined, {}, {});

    expect(consoleGroupSpy).toHaveBeenCalledTimes(1);
    expect(consoleGroupSpy).toHaveBeenCalledWith('not-persisted');

    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'oldState:', {});
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'newState:', {});

    expect(consoleGroupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('should log action as console.log in case of exception', () => {
    const consoleGroupSpy = jest
      .spyOn(global.console, 'group')
      .mockImplementation(() => {
        throw Error();
      });
    const consoleLogSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(global.console, 'groupEnd')
      .mockImplementation();

    const storeName = 'testStore';
    const actionName = 'testAction';

    $tate._logStateUpdate(storeName, actionName, {}, {});

    expect(consoleGroupSpy).toHaveBeenCalledTimes(1);
    expect(consoleGroupSpy).toHaveBeenCalledWith(storeName);

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(storeName, {
      action: actionName,
      newState: {},
      oldState: {},
    });

    expect(consoleGroupEndSpy).not.toHaveBeenCalled();
  });
});

describe('created store', () => {
  it('should expose required methods', () => {
    const store = $tate.createStore();

    expect(store).toBeDefined();
    expect(store.getState).toBeInstanceOf(Function);
    expect(store.resetState).toBeInstanceOf(Function);
    expect(store.updateState).toBeInstanceOf(Function);
    expect(store.subscribe).toBeInstanceOf(Function);
  });

  it('should clone initialState - [NO REF]', () => {
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState);

    expect(store).toBeDefined();
    expect(store.getState()).not.toBe(initialState);
  });

  it('should updateState', () => {
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState);

    store.updateState(state => {
      state.a = 2;
    });

    expect(store.getState()).toStrictEqual({ a: 2 });
    expect(initialState).toStrictEqual(initialState);
  });

  it('should NOT updateState if updaterFn is not a function', () => {
    const consoleErrorSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementation();
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState);

    store.updateState();

    expect(store.getState()).toStrictEqual({ a: 1 });
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'updaterFn MUST be a function.',
    );
  });

  it('should throw when updating state without updateState (in Debug mode)', () => {
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState, { isDebug: true });

    expect(() => {
      store._state.a = 2;
    }).toThrow();
    expect(store.getState()).not.toStrictEqual({ a: 2 });
  });

  it('should allow subscribers functions', () => {
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState, { isDebug: true });

    const unsubscribe = store.subscribe(jest.fn());

    expect(unsubscribe).toBeInstanceOf(Function);
  });

  it('should allow subscribers functions to be unsubscribed', () => {
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState, { isDebug: true });

    expect(store._listeners).toHaveLength(0);

    const unsubscribe = store.subscribe(jest.fn());

    expect(unsubscribe).toBeInstanceOf(Function);
    expect(store._listeners).toHaveLength(1);

    unsubscribe();
    expect(store._listeners).toHaveLength(0);
  });

  it('should NOT allow subscribers that are not functions', () => {
    const consoleErrorSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementation();
    const initialState = { a: 1 };
    const fakeError = new Error('fake error');

    const store = $tate.createStore(initialState, { isDebug: true });

    const unsubscribe = store.subscribe(() => {
      throw fakeError;
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Subscriber function failed with error:',
      fakeError,
    );
    expect(unsubscribe).toBeDefined();
  });

  it('should NOT throw when subscriber functions fails', () => {
    const consoleErrorSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementation();
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState, { isDebug: true });

    const unsubscribe = store.subscribe({});

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'subscriberFn MUST be a function.',
    );
    expect(unsubscribe).not.toBeDefined();
  });

  it('should log state updates when in DEBUG mode', () => {
    const $tateLoggerSpy = jest
      .spyOn($tate, '_logStateUpdate')
      .mockImplementation();

    const initialState = { a: 1 };

    const store = $tate.createStore(initialState, { isDebug: true });

    store.updateState(state => {
      state.a = 2;
    });

    expect(store.getState()).toStrictEqual({ a: 2 });
    expect($tateLoggerSpy).toHaveBeenCalled();
  });

  it('should resetState when required', () => {
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState, { isDebug: true });

    store.updateState(state => {
      state.a = 2;
    });

    expect(store.getState()).toStrictEqual({ a: 2 });

    store.resetState();

    expect(store.getState()).toStrictEqual({ a: 1 });
  });

  it('should notify subscribers after stateUpdate', () => {
    const mockSubscriber = jest.fn();
    const initialState = { a: 1 };

    const store = $tate.createStore(initialState);

    const unsubscribe = store.subscribe(mockSubscriber);

    store.updateState(state => {
      state.a = 2;
    });

    expect(store.getState()).toStrictEqual({ a: 2 });

    expect(mockSubscriber).toHaveBeenCalledTimes(2);
    expect(mockSubscriber).toHaveBeenNthCalledWith(1, { a: 1 });
    expect(mockSubscriber).toHaveBeenNthCalledWith(2, { a: 2 });

    unsubscribe();
  });

  it('should notify all subscribers after stateUpdate even if one fails', () => {
    const consoleErrorSpy = jest
      .spyOn(global.console, 'error')
      .mockImplementation();
    const fakeError = new Error('fake error');
    const mockSubscriber = jest.fn();
    const mockSubscriber2 = jest.fn(() => {
      throw fakeError;
    });

    const initialState = { a: 1 };
    const store = $tate.createStore(initialState);

    const unsubscribe = store.subscribe(mockSubscriber);
    const unsubscribe2 = store.subscribe(mockSubscriber2);

    store.updateState(state => {
      state.a = 2;
    });

    expect(store.getState()).toStrictEqual({ a: 2 });

    expect(mockSubscriber).toHaveBeenCalledTimes(2);
    expect(mockSubscriber).toHaveBeenNthCalledWith(1, { a: 1 });
    expect(mockSubscriber).toHaveBeenNthCalledWith(2, { a: 2 });

    expect(mockSubscriber2).toHaveBeenCalledTimes(2);
    expect(mockSubscriber2).toHaveBeenNthCalledWith(1, { a: 1 });
    expect(mockSubscriber2).toHaveBeenNthCalledWith(2, { a: 2 });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(
      1,
      'Subscriber function failed with error:',
      fakeError,
    );
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(
      2,
      'Subscriber function failed with error:',
      fakeError,
    );

    unsubscribe();
    unsubscribe2();
  });
});

describe('persistence', () => {
  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  });

  it('should not try to persist data if persistenceKey is not specified', () => {
    const store = $tate.createStore({ a: 1 });
    expect(localStorage.getItem).not.toHaveBeenCalled();
  });

  it('should not try to persist data if localStorage is not available', () => {
    const localStorageAvailabilityMock = jest
      .spyOn($tate, '_checkLocalStorageAvailability')
      .mockImplementationOnce(() => false);

    const store = $tate.createStore({ a: 1 }, { persistenceKey: 'test' });

    expect(localStorage.getItem).not.toHaveBeenCalled();
  });

  it('should try to retrieve persisted data if persistenceKey is specified', () => {
    const store = $tate.createStore(
      {},
      {
        persistenceKey: 'test',
      },
    );

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should restore state from retrieve persisted data', () => {
    localStorage.setItem('test', '{"a":1}');

    const store = $tate.createStore(
      {},
      {
        persistenceKey: 'test',
      },
    );

    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(store.getState()).toStrictEqual({ a: 1 });
  });

  it('should merge state from retrieve persisted data', () => {
    localStorage.setItem('test', '{"a":1}');

    const store = $tate.createStore(
      {
        b: 2,
      },
      {
        persistenceKey: 'test',
      },
    );

    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(store.getState()).toStrictEqual({ a: 1, b: 2 });
  });

  it('should persist updated state', () => {
    const store = $tate.createStore(
      {
        b: 2,
      },
      {
        persistenceKey: 'test',
      },
    );

    store.updateState(state => {
      state.b = 3;
    });

    expect(store.getState()).toStrictEqual({ b: 3 });
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
  });
});
