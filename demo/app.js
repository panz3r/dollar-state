// Store
var store = $tate.createStore({
  count: 0,
  clicks: []
});

function increment() {
  store.updateState(function(currentState) {
    currentState.count++;
    currentState.clicks.push('+');
  }, 'increment');
}

function decrement() {
  store.updateState(function(currentState) {
    if (currentState.count > 0) {
      currentState.count--;
      currentState.clicks.push('-');
    }
  }, 'decrement');
}

// Persisted Store
var persistedStore = $tate.createStore(
  {
    count: 0,
    clicks: []
  },
  {
    persistenceKey: 'persistedCount',
    isDebug: true
  }
);

function incrementPersisted() {
  persistedStore.updateState(function(currentState) {
    currentState.count++;
    currentState.clicks.push('+');
  }, 'incrementPersisted');
}

function decrementPersisted() {
  persistedStore.updateState(function(currentState) {
    if (currentState.count > 0) {
      currentState.count--;
      currentState.clicks.push('-');
    }
  }, 'decrementPersisted');
}

function resetPersisted() {
  persistedStore.resetState();
}

var formStore = $tate.createStore({ email: '', checked: false }, { persistenceKey: 'loginForm' });

var formStoreSub = $tate.createStore(
  { email: '', checked: false },
  { persistenceKey: 'loginFormSubscribe', isDebug: true }
);

// Main
$(document).ready(function() {
  // Connect input to state
  var _unsubscribe = store.subscribe(function(newState) {
    $('#count').text(newState.count);
  });
  //_unsubscribe();

  // Connect input to persisted state - demo restoring state using 'subscribe'
  var _unsubscribePersisted = persistedStore.subscribe(function(newState) {
    $('#persisted-count').text(newState.count);
  });
  //_unsubscribePersisted();

  // Restore form state from persisted store - demo usage of getState()
  var _formState = formStore.getState();
  $('#exampleInputEmail1').val(_formState.email);
  $('#exampleCheck1').prop('checked', _formState.checked);

  // Listen for changes on input field
  $('#exampleInputEmail1').on('input', function() {
    var email = $(this).val();
    formStore.updateState(function(state) {
      state.email = email;
    }, 'changeEmailAddress');
  });
  $('#exampleCheck1').change(function() {
    var checked = $(this).prop('checked');
    formStore.updateState(function(state) {
      state.checked = checked;
    }, 'changeCheckboxState');
  });

  // Restore form state from persisted store - demo usage of subscribe() with forms
  var _unsubscribeFormState = formStoreSub.subscribe(function(newState) {
    $('#exampleInputEmail2').val(newState.email);
    $('#exampleCheck2').prop('checked', newState.checked);
  });

  // Listen for changes on input field
  $('#exampleInputEmail2').on('input', function() {
    var email = $(this).val();
    formStoreSub.updateState(function(state) {
      state.email = email;
    }, 'changeEmailAddress');
  });
  $('#exampleCheck2').change(function() {
    var checked = $(this).prop('checked');
    formStoreSub.updateState(function(state) {
      state.checked = checked;
    }, 'changeCheckboxState');
  });
});
