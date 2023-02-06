# Northcoders House of Games API

<a href="https://nc-games-9h15.onrender.com">Link to the backend project</a>

## Background:

The project is an API that allows for programmatic access to application data (game reviews). The API is designed to mimic a real-world backend service, such as Reddit, and will provide data to the front-end architecture. The database used in this project is PostgreSQL and it will be interacted with using the node-postgres library.

## API endpoints:

To get a list of all endpoints: <code>GET: /api</code>

## How to use:

### Git clone:

run the following into a directory of your choice in the terminal:
<br>
<code>git clone https://github.com/H3nry-T/backend-project-nc-games.git</code>

### Dependencies:

Install dependencies in the terminal using the following:
<br>
<code>npm install</code>
<br>
<br>
Here is what you should have in the package.json file in the root:
<br>

<pre>
    "dependencies": {
        "dotenv": "^16.0.0",
        "express": "^4.18.2",
        "pg": "^8.7.3",
        "supertest": "^6.3.3"
    },
    "devDependencies": {
        "husky": "^8.0.2",
        "jest": "^27.5.1",
        "jest-extended": "^2.0.0",
        "pg-format": "^1.0.4"
    },
</pre>

### Environment:

<ol>
    <li>make a dotenv file called <code>.env.test</code></li>
    <li>Setup your dotenv file to include the following: <code>PGDATABASE=nc_games_test</code> </li>
    <li>make a dotenv file called <code>.env.development</code></li>
    <li>Setup your dotenv file to include the following: <code>PGDATABASE=nc_games</code> </li>
</ol>

### Seeding the database:

<code>npm run setup-dbs</code><br>
<code>npm run seed</code><br>

### Testing:

<code>npm run test</code>

### Minimum versions:

<bold>Node.js: v18.12.1</bold><br>
<bold>Postgres: v15.1</bold>
