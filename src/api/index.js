const Hapi = require("@hapi/hapi");
const bcrypt = require("bcrypt");
const config = require("../../knexfile").development;
const knex = require("knex")(config);

const users = [
	{
		username: "john",
		password: "$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm", // 'secret'
		name: "John Doe",
		id: "2133d32a",
	},
];

const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: "localhost",
	});

	await server.register(require("@hapi/cookie"));

	server.auth.strategy("session", "cookie", {
		cookie: {
			name: "sid-challenge",
			password: "^Hidkan3*34m*3421n&45*&($*ngnjkf",
			isSecure: false,
		},
		redirectTo: "/login",
		validateFunc: async (request, session) => {
			const account = (await knex("user").where("id", session.id))[0];

			if (!account) {
				return { valid: false };
			} else
				return {
					valid: true,
					credentials: {
						id: account.id,
						name: account.name,
						email: account.email,
					},
				};
		},
	});

	server.auth.default("session");

	server.route([
		{
			method: "GET",
			path: "/",
			handler: async (request, h) => {
				const name = request.auth.credentials.name;
				const email = request.auth.credentials.email;

				return {
					msg: `Welcome to a Hapi world, ${name}, your email is: ${email}`,
				};
			},
		},
		{
			method: "GET",
			path: "/login",
			handler: function (request, h) {
				return ` <html>
                            <head>
                                <title>Login page</title>
                            </head>
                            <body>
                                <h3>Please Log In</h3>
                                <form method="post" action="/login">
                                    Email: <input type="email" name="email"><br>
                                    Password: <input type="password" name="password"><br/>
                                <input type="submit" value="Login"></form>
                            </body>
                        </html>`;
			},
			options: {
				auth: false,
			},
		},
		{
			method: "POST",
			path: "/login",
			handler: async (request, h) => {
				const { email, password } = request.payload;
				const account = (await knex("user").where({ email }))[0];
				console.log("password from form", password);
				console.log("password from db", account.password);
				if (!account || (await !bcrypt.compare(password, account.password))) {
					console.log("wrong password");
					return h.view("/login");
				}

				request.cookieAuth.set({
					id: account.id,
					name: account.name,
					email: account.email,
				});
				return h.redirect("/");
			},
			options: {
				auth: { mode: "try" },
			},
		},
	]);

	await server.start();
	console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();
