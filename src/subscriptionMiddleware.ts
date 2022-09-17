import { useEffect } from "react";
import { Middleware, SWRHook, unstable_serialize } from "swr";

import { useSubscription } from "./useSubscription";
import type { SubscribeFn, Event } from "./types";

const subscriptionMiddleware =
  (event: Event, subscription: SubscribeFn): Middleware =>
  (useSWRNext: SWRHook) => {
    return (key, fetcher, config) => {
      const listener = useSubscription();
      const swr = useSWRNext(key, fetcher, config);

      const keyString = unstable_serialize(key);
      useEffect(() => {
        listener.subscribe(keyString, event, subscription);

        return () => listener.unsubscribe(keyString);
      }, [keyString]);

      return swr;
    };
  };

export { subscriptionMiddleware };
