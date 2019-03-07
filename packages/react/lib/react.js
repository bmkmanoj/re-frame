import React from "react"
import {flatten} from "@re-frame/utils"

var useContext = React.useContext
var useEffect = React.useEffect
var useState = React.useState

export var StoreContext = React.createContext()
export var StoreProvider = StoreContext.Provider

export function useStore() {
  var store = useContext(StoreContext)
  return [useSubscription, store.dispatch]
}

export function useDispatch(event) {
  var store = useContext(StoreContext)
  if (event) {
    useEffect(function() {
      store.dispatch(event)
    }, event)
  }
  return store.dispatch
}

export function useSubscription(query) {
  var store = useContext(StoreContext)
  var state = useState()
  var value = state[0]
  var setValue = state[1]

  useEffect(function() {
    var subscription = store.subscribe(query)
    setValue(subscription.deref())
    subscription.watch(function(prev, next) {
      setValue(next)
    })
    return function() {
      subscription.dispose()
    }
  }, query)

  return value
}

export function useSubscriptions(queries) {
  var store = useContext(StoreContext)
  var state = useState([])
  var value = state[0]
  var setValue = state[1]

  useEffect(function() {
    var subscriptions = queries.map(store.subscribe)

    subscriptions.forEach(function(subscription) {
      subscription.watch(recompute)
    })

    function recompute() {
      setValue(
        subscriptions.map(function(subscription) {
          return subscription.deref()
        })
      )
    }

    return function() {
      subscriptions.forEach(function(subscription) {
        subscription.dispose()
      })
    }
  }, flatten(queries))

  return value
}
