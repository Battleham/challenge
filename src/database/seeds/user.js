const bcrypt = require("bcrypt");
exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("user")
		.del()
		.then(async () => {
			// Inserts seed entries
			const hashedPwd1 = await bcrypt.hash("YuraRules!", 8);
			const hashedPwd2 = await bcrypt.hash("password", 8);

			return knex("user").insert([
				{
					id: 1,
					email: "yuriy@gmail.com",
					password: hashedPwd1,
					name: "Yuriy",
				},
				{
					id: 2,
					email: "karman@gmoil.com",
					password: hashedPwd2,
					name: "Karman",
				},
			]);
		});
};
