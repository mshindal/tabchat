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

export const emitNewComment = (comment: Comment, url: string) => {
	console.log(`Emitting new comment ${comment.id} to url ${url}`);
	io.to(url).emit(eventNames.newComment, comment);
}

export const emitDeleteComment = (commentId: number, url: string) => {
  console.log(`Emitting delete comment ${commentId} to url ${url}`);
  io.to(url).emit(eventNames.deleteComment, commentId);
}
