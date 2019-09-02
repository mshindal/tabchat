import * as SocketIO from 'socket.io';
import eventNames from './eventNames';
import { server } from './app';
import { Comment } from './models';

console.log(`Initializing Socket.IO`);

const io = SocketIO(server);

io.on(eventNames.connect, socket => {
	console.log(`New connection from ${socket.id}`);

	socket.on(eventNames.join, url => onJoin(url, socket));
	socket.on(eventNames.leave, url => onLeave(url, socket));
  socket.on(eventNames.disconnect, reason => onDisconnect(reason, socket));
});

const onJoin = (url: string, socket: SocketIO.Socket) => {
	console.log(`${socket.id} joined ${url}`);
	socket.join(url, err => err && console.error(`Error while joining ${socket.id} to room ${url}`, err));
}

const onLeave = (url: string, socket: SocketIO.Socket) => {
	console.log(`${socket.id} left ${url}`);
	socket.leave(url, err => err && console.error(`Error while leaving ${socket.id} from room ${url}`, err));
}

const onDisconnect = (reason: string, socket: SocketIO.Socket) => {
	console.log(`${socket.id} disconnected for reason: ${reason}`);
	socket.removeAllListeners();
}

export const emitNewComment = (comment: Comment, url: string, originatingSocketID?: string) => {
  // get the socket of the person who created the new comment
  const originatingSocket = io.sockets.connected[originatingSocketID];
  // if we can't find it, they must have disconnected after making it,
  // or originatingSocketID was undefined,
  // so simply emit the new comment to everyone in the room with `canDelete: false`
  if (originatingSocket === undefined) {
    console.log(`Emitting new comment with canDelete: false to url ${url}`);
    io.to(url).emit(eventNames.newComment, {
      ...comment,
      canDelete: false
    });
  // otherwise, the user who made the comment is still in the room
  } else {
    // to everyone except the user who created the comment,
    // emit the new comment with `canDelete: false`
    console.log(`Emitting new comment with canDelete: false to url ${url}, except for socket ${originatingSocketID}`);
    originatingSocket.to(url).emit(eventNames.newComment, {
      ...comment,
      canDelete: false
    });
    // to the user who created the comment, emit the new comment
    // with `canDelete: true`
    console.log(`Emitting new comment with canDelete: true to socket ${originatingSocketID}`);
    io.to(originatingSocketID).emit(eventNames.newComment, {
      ...comment,
      canDelete: true
    });
  }
}

export const emitDeleteComment = (commentId: number, url: string) => {
  console.log(`Emitting delete comment ${commentId} to url ${url}`);
  io.to(url).emit(eventNames.deleteComment, commentId);
}
