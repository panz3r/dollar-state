/*
 * Copyright (c) 2018 Mattia Panzeri <mattia.panzeri93@gmail.com>
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 */

import produce, { setAutoFreeze } from 'immer';

export default class $tate {
  static _logStateUpdate(storeName, actionName, oldState, newState) {
    try {
      console.group(storeName || 'not-persisted');

      console.log('oldState:', oldState);

      !!actionName && console.log('action:', actionName);

      console.log('newState:', newState);

      console.groupEnd();
    } catch (e) {
      console.log(storeName, { oldState, action: actionName, newState });
    }
  }

  static createStore(initialState, { persistenceKey, isDebug = false } = {}) {
    // DEVELOPMENT PURPOSE - Remove when running in PRODUCTION mode
    setAutoFreeze(isDebug);

    // Check if localStorage is available
    let _storage;
    try {
      _storage = window.localStorage;
    } catch (e) {
      console.error("Failed to retrieve LocalStorage. Persistence won't be available.", e);
    }

    let hydratedInitialState = initialState || {};
    // Restore state if it was persisted
    if (_storage && persistenceKey && _storage.getItem(persistenceKey)) {
      hydratedInitialState = Object.assign({}, initialState, JSON.parse(_storage.getItem(persistenceKey)));
    }

    // Create STORE object
    const store = {
      _storage: _storage,
      _persistenceKey: persistenceKey,
      _state: produce({}, function(draftState) {
        Object.assign(draftState, hydratedInitialState);
      }), // state is an object
      _listeners: [], // listeners are an array of functions
      subscribe: function(subscriberFn) {
        if (typeof subscriberFn !== 'function') {
          console.error('subscriberFn MUST be a function.');
          return;
        }

        const newIndex = this._listeners.push(subscriberFn) - 1;
        const store = this;

        try {
          subscriberFn(this._state);
        } catch (error) {
          console.error('Subscriber function failed with error:', error);
        }

        return function() {
          store._listeners.splice(newIndex, 1);
        };
      },
      updateState: function(updaterFn, actionName) {
        if (typeof updaterFn !== 'function') {
          console.error('updaterFn MUST be a function.');
          return;
        }

        const newState = produce(this._state, updaterFn);

        if (isDebug) {
          $tate._logStateUpdate(this._persistenceKey, actionName, Object.assign({}, this._state), newState);
        }

        this._state = newState;
        this._listeners.forEach(function(listener) {
          try {
            listener(newState);
          } catch (error) {
            console.error('Subscriber function failed with error:', error);
          }
        });

        // Persist to LocalStorage (if available)
        if (this._storage && this._persistenceKey) {
          this._storage.setItem(this._persistenceKey, JSON.stringify(newState));
        }
      },
      getState: function() {
        return this._state;
      }
    };

    return store;
  }
}
