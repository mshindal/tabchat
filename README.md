# Tabchat

A browser extension that lets you leave comments on any webpage. Like [Dissenter](https://dissenter.com/), but you can comment anonymously, and with Reddit's tree style comments. 

It's available now on Chrome: 

And Firefox: 

## Building

### Backend

You need Node, Yarn, and Docker (with docker-compose). 

Start it like so (inside the `backend` directory):

```
yarn install
docker-compose up
```

It runs at http://localhost:3000. 

### Frontend

You need Node and Yarn. 

Start it with the following commands (inside the `frontend` directory):

```
yarn install
yarn start
```

The built files are in the `frontend/extension` directory, and can be installed in Chrome by loading it as an [Unpacked Extension](https://developer.chrome.com/extensions/getstarted#manifest), or installed in Firefox as a [Temporary Add-on](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

## Configuration

Configuration is done through environment variables. If an environment variable isn't set, it will fallback to its default value specified in the `.env` files in the `frontend` and `backend` directories. These defaults are set up in such a way that you can run Tabchat right after cloning it without having to configure anything.

|Environment Varible|Description|Default Value|
|-------------------|-------|-------------|
|USE_RECAPTCHA      |Whether or not reCAPTCHA should be enabled|false|
|RECAPTCHA_SITEKEY|Key supplied by Google, used for reCAPTCHA on the frontend|empty|
|RECAPTCHA_SECRET|Another key supplied by Google, used for reCAPTCHA on the backend|empty|
|SERVER_URL|The URL that the backend is running on|http://localhost:3000|
|MAX_COMMENT_LENGTH|Pretty self explanatory - the maximum length of a comment that is accepted|4000|
|NODE_ENV|Sets the environment for Express.js|development|
|DATABASE_URL|A connection string pointing to a Postgres database|postgres://postgres:changeme@db:5432/postgres|
|POSTGRES_PASSWORD|The password of the Postgres database we will spin up|changeme|
|PORT|The port the backend will listen on|3000|

## Icon

Chat icon by [Smashicons](https://www.flaticon.com/free-icon/chat_134920)
