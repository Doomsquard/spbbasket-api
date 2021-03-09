const express = require("express");
const bodyParse = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { db } = require("./dbConfig.js");
const { users } = require("./src/funcList.js");
const { signUp } = require("./controlers/signUp.js");
const { signIn } = require("./controlers/signIn.js");

const app = express();
const PORT = 3000;
//procces.env.PORT;

app.use(bodyParse.json());
app.use(cors());
//---------------------GET-------------------

app.get("/api/users", (req, res) =>
	users.getAll(req, res).then((data) => res.json(data))
);

//---------------------POST------------------

app.post("/api/auth/signup", (req, res) => signUp(req, res, db, bcrypt));
app.post("/api/auth/signin", (req, res) => signIn(req, res, db, bcrypt));

app.listen(PORT, () => {
	console.log(`server start on port:${PORT}`);
});
