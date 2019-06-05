// Tiny wrapper around the messaging system with some type safety

export interface IPCMessage<T> {
  name: string;
  payload: T;
}

export const sendMessage = <T>(message: IPCMessage<T>) => 
  browser.runtime.sendMessage(message);

export const addListener = (callback: (message: IPCMessage<any>) => any) =>
  browser.runtime.onMessage.addListener(callback);

export const removeListener = (callback: (message: IPCMessage<any>) => any) => 
  browser.runtime.onMessage.removeListener(callback);