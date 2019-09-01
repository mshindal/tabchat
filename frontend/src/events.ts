import * as io from 'socket.io-client';
import eventNames from '../../backend/src/eventNames';

let socket: SocketIOClient.Socket = null;

export const getSocket = new Promise<SocketIOClient.Socket>((res, rej) => {
  if (socket !== null) {
    return socket;
  } else {
    console.log('Connecting to Socket.IO');
    socket = io(SERVER_URL);
    // https://socket.io/docs/client-api/#Event-%E2%80%98connect-error%E2%80%99-1
    socket.on(eventNames.connectError, error => {
      const errorMessage = 'A connection error occured while connecting to Socket.IO';
      console.error(errorMessage, error);
      rej(new Error(errorMessage));
    });
    // https://socket.io/docs/client-api/#Event-%E2%80%98connect-timeout%E2%80%99-1
    socket.on(eventNames.connectTimeout, timeout => {
      const errorMessage = 'Timeout occured while trying to connect to Socket.IO';
      console.error(errorMessage, timeout);
      rej(new Error(errorMessage));
    });
    // https://socket.io/docs/client-api/#Event-%E2%80%98connect%E2%80%99
    socket.on(eventNames.connect, () => {
      console.log('Connected to Socket.IO');
      res(socket);
    });
  }
});
