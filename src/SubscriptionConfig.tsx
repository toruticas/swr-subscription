import React, { createContext, useRef, useCallback, FC } from "react";
import type { SubscribeFn, Event, Key, Listener } from "./types";

export interface SubscriptionContextType {
  subscribe: (key: Key, event: Event, subscription: SubscribeFn) => void;
  unsubscribe: (key: Key) => void;
  emit: (key: Event, data: any) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const SubscriptionConfig: FC = (props) => {
  const listeners = useRef(new Map<Key, Listener>());

  const subscribe = useCallback(
    (key: Key, event: Event, subscription: SubscribeFn) => {
      const listener = listeners.current.get(key);

      if (!listener) {
        listeners.current.set(key, {
          event,
          smartCounter: 1,
          callback: subscription,
        });

        return;
      }

      listener.smartCounter++;
      listener.callback = subscription;
    },
    []
  );

  const unsubscribe = useCallback((key: Key) => {
    const listener = listeners.current.get(key);

    if (!listener) {
      return console.warn(
        "an dispatch tryied to unsubscribe a nonexistent subscription"
      );
    }

    if (listener.smartCounter > 1) {
      listener.smartCounter--;

      return;
    }

    listeners.current.delete(key);
  }, []);

  const emit = useCallback((event: Event, data: any) => {
    listeners.current.forEach((listener) => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscribe,
        unsubscribe,
        emit,
      }}
      {...props}
    />
  );
};

export { SubscriptionConfig, SubscriptionContext };
