const { login, users } = require("../src/funcList.js");

const signIn = (req, res, db, bcrypt) => {
	const { email, password } = req.body;
	login
		.getItemsByProp("hash", "email", "=", email)
		.then((hash) => {
			if (hash.length) {
				const currentHash = hash[0].hash;
				const validPas = bcrypt.compareSync(password, currentHash);
				if (validPas) {
					db.select("*")
						.from("users")
						.where("email", "=", email)
						.update({ logdate: new Date() })
						.increment("entries", 1)
						.returning("entries")
						.then((data) => data);

					res.json("success");
				} else {
					res.status(400).json({
						message: "Email или пароль введены не верно",
					});
				}
			} else {
				res.status(400).json({ message: "Пользователь не найден" });
			}
		})
		.catch((err) => res.status(400).json(err));
};

module.exports = {
	signIn,
};
