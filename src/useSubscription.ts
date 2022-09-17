import { useContext } from "react";
import { SubscriptionContext } from "./SubscriptionConfig";

const useSubscription = () => {
  const listener = useContext(SubscriptionContext);

  if (!listener) {
    throw new Error("You cannot call a hook outside the subscription Provider");
  }

  return listener;
};

export { useSubscription };
