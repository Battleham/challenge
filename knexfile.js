require("dotenv").config();

module.exports = {
	development: {
		client: "pg",
		connection: process.env.PG_CONNECTION_STRING,
		pool: {
			min: 0,
			max: 8,
		},
		migrations: {
			directory: "./src/database/migrations",
		},
		seeds: {
			directory: "./src/database/seeds",
		},
	},
};
