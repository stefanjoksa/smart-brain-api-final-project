const handleSignin = async (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  try {
    const data = await db
      .select("email", "hash")
      .where("email", "=", email)
      .from("login");

    if (data.length === 0) {
      return res.status(400).json("wrong credentials");
    }

    const isValid = await bcrypt.compare(password, data[0].hash);
    if (isValid) {
      const user = await db
        .select("*")
        .from("users")
        .where("email", "=", email);

      if (user.length === 0) {
        return res.status(400).json("unable to get user");
      }
      res.json(user[0]);
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (err) {
    res.status(500).json("internal server error");
  }
};

module.exports = {
  handleSignin,
};
