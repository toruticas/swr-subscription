import { SWRResponse } from "swr";

export type SubscribeFn = (...args: any[]) => void;
export type SubscriptionFn = (data: any, swr: SWRResponse) => void;
export type Event = string;
export type Key = string;

export interface Listener {
  event: Event;
  callback: SubscribeFn;
  smartCounter: number;
}
