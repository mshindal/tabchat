export default Object.freeze({
	// Fired when a user navigates to a page
	join: 'join',
	// Fired when a user leaves a page
	leave: 'leave',
	// Fired when a new comment is posted to a page
  newComment: 'new_comment',
  // Fired when a comment is deleted
  deleteComment: 'delete_comment',
	// https://socket.io/docs/client-api/#Event-%E2%80%98disconnect%E2%80%99
	disconnect: 'disconnect',
	// https://socket.io/docs/client-api/#Event-%E2%80%98connect%E2%80%99
	connect: 'connect',
	// https://socket.io/docs/client-api/#Event-%E2%80%98connect-error%E2%80%99-1
	connectError: 'connect_error',
	// https://socket.io/docs/client-api/#Event-%E2%80%98connect-timeout%E2%80%99-1
	connectTimeout: 'connect_timeout'
});
