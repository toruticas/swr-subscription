import { useEffect, useRef } from "react";
import { Middleware, SWRHook, unstable_serialize } from "swr";

import { useSubscription } from "./useSubscription";
import type { Event, SubscriptionFn } from "./types";

const subscriptionMiddleware =
  (event: Event, subscription: SubscriptionFn): Middleware =>
  (useSWRNext: SWRHook) => {
    return (key, fetcher, config) => {
      const listener = useSubscription();
      const swr = useSWRNext(key, fetcher, config);
      const latestSwr = useRef(swr);
      latestSwr.current = swr;

      const keyString = unstable_serialize(key);
      useEffect(() => {
        listener.subscribe(keyString, event, (data) =>
          subscription(data, latestSwr.current)
        );

        return () => listener.unsubscribe(keyString);
      }, [keyString]);

      return swr;
    };
  };

export { subscriptionMiddleware as subscription };
