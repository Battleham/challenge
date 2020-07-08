exports.up = function (knex) {
	return knex.schema.createTable("user", (table) => {
		table.increments("id");
		table.string("email").unique();
		table.string("password");
		table.string("name");
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("user");
};
