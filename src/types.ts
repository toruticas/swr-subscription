export type SubscribeFn = (data: any) => void;
export type Event = string;
export type Key = string;

export interface Listener {
  event: Event;
  callback: SubscribeFn;
  smartCounter: number;
}

export interface SubscriptionContextType {
  subscribe: (key: Key, event: Event, subscription: SubscribeFn) => void;
  unsubscribe: (key: Key) => void;
  emit: (key: Event, data: any) => void;
}
