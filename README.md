# AGConsole

Another Angular/NodeJS starter project.

## Server

RestAPI server with NodeJS, Express, PassportJS, MongoDB and Mocha/Chai tests.

To start server you should have MongoDB installed and running.

To add test users to the database you have to run the following command: ```node server/utils/users-seed.js```

I use yarn instead of npm. You can try to use npm, I hope it will also work.

In server folder run the following commands:

```
yarn (or npm install)
cp -r config.dev config
yarn start (or npm start, or nodemon)
```

The server will be available on http://localhost:3000/

### Tests

```yarn run test```
```yarn run lint```

## Client

Angular 5 with Bootstrap 4 (beta) and Angular CLI.

To start client in development mode you should set property allowCORS to true in server's main.js config.

In client folder run the following commands:

```
yarn (or npm install)
ng serve
```

The client will be available on http://localhost:4200/

To build client in production mode run ```ng build``` command. It will be available on the same url as server.
