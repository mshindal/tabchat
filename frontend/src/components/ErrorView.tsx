import * as React from 'react';

interface Props {
	error: Error;
}

export const ErrorView = (props: Props) => 
	<div className="error-view">
		<span>{props.error.message} 😕</span>
	</div>