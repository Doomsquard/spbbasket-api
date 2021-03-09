const { createTable } = require("./tableCreater.js");
const { db } = require("../dbConfig.js");

class funcList extends createTable {
	constructor(db, table) {
		super(db, table);
	}

	async getItemsByProp(needed, prop, method, value) {
		return await this.db
			.select(needed)
			.from(this.table)
			.where(prop, method, value);
	}

	async getAll() {
		return await this.db.select("*").from(this.table);
	}

	async getItemById(id) {
		return await this.db.select("*").from(this.table).where({ id });
	}
}

const users = new funcList(db, "users");
const login = new funcList(db, "login");
const infoUsers = new funcList(db, "infoUsers");
const workout = new funcList(db, "workout");

module.exports = {
	users,
	login,
	infoUsers,
	workout,
};
