const signUp = (req, res, db, bcrypt) => {
	const { firstname, lastname, email, password } = req.body;

	const salt = bcrypt.genSaltSync(7);
	const hash = bcrypt.hashSync(password, salt);

	if (!firstname || !lastname || !email || !password) {
		res.status(400).json("invalid form");
	}

	db.select("*")
		.from("users")
		.where("email", "=", email)
		.then((user) =>
			user.length
				? res
						.status(400)
						.send("Пользователь с таким email уже существует")
				: db
						.transaction((trx) => {
							trx.insert({
								hash,
								email,
							})
								.into("login")
								.returning("email")
								.then((loginEmail) => {
									trx.insert({
										email: loginEmail[0],
										firstname,
										lastname,
										entries: 0,
										logdate: new Date(),
										regdate: new Date(),
									})
										.into("users")
										.returning("email")
										.then((loginEmail) => {
											trx.insert({
												email: loginEmail[0],
											})
												.into("workout")
												.returning("email")

												.then((loginEmail) => {
													return trx("infousers")
														.returning("*")
														.insert({
															email:
																loginEmail[0],
														});
													then((data) =>
														res.json(
															"Пользователь успешно зарегистрирован"
														)
													);
												})
												.then(trx.commit)
												.catch(trx.rollback);
										});
								});
						})
						.then(
							res.json({
								message: "Пользователь успешно зарегистрирован",
							})
						)
						.catch((err) => res.status(400).json(err))
		);
};

module.exports = {
	signUp,
};
