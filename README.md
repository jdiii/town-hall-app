# town-hall-app
Q&amp;A app. Encourage participation in town halls or all-hands meetings.

town-hall-app is meant for start-ups who want to empower team members to ask and upvote questions about the state of the org.

Questions and upvotes are sent in real-time to other participants. Moderator interactions also propogate in real-time.

Built on express, socket.io, and passport.js. Requires node.js, mongodb, and a Google account. Authentication is by Google OAuth only.

## Installation
  1. clone `https://github.com/jdiii/town-hall-app/`
  2. install dependencies: `npm install`
  3. configure via the `config/config.js` file
  4. `npm start`

## Configuration
Most configuration is via `config/config.js`. You can optionally add a welcome message via the `config/header-message.jade` file (e.g., you could post a video link to your all-hands meeting).

### Database
town-hall-app requires a mongodb database. You can configure which server, db, data collection, and user collection to use.

### Google Auth
Access requires a Google+ account. You may limit user access to the app by Google Apps domain.

### Internal Settings
You can configure a custom app title and logo. Also, you can configure a moderator password, if desired.

## Moderation
Mod powers include marking a question as "answered" or "deleted". Both these options remove the question from public view and note them in the db accordingly. You can log in as a moderator by going to `/mod?secret={{secret}}`. The moderator secret password can be configured in `config/config.js`. 

## Security
  * Requests to the main app page are authenticated using Google OAuth
  * You can limit access by Google Apps domain, but not user
  * Asynchronous requests between server and client are _not_ authenticated
  * All requests are made over HTTP

## License
[Covered by the MIT license.](./LICENSE)
