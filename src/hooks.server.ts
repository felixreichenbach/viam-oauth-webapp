import { handleSession } from 'svelte-kit-cookie-session';

// You can do it like this, without passing a own handle function
export const handle = handleSession({
	// Optional initial state of the session, default is an empty object {}
	// init: (event) => ({
	// 	views: 0
	// }),
	// chunked: true // Optional, default is false - if true, the session will be chunked into multiple cookies avoiding the browser limit for cookies
	secret: 'SOME_COMPLEX_SECRET_32_CHARSLONG',
	cookie: {
		path: '/'
	}
});
