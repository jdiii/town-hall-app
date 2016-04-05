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
The MIT License (MIT)

Copyright (c) 2016 John Davey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
