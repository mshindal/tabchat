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

