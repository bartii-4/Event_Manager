const User = require("../models/User");

exports.showRegister = (req, res) => {
  res.render("auth/register", { errors: [] });
};

exports.register = async (req, res) => {
  const { username, password, confirm } = req.body;
  const errors = [];
  if (!username || username.length < 3) errors.push("Nazwa użytkownika minimalnie 3 znaki");
  if (!password || password.length < 6) errors.push("Hasło minimalnie 6 znaków");
  if (password !== confirm) errors.push("Hasła nie są zgodne");
  if (errors.length) return res.render("auth/register", { errors });

  try {
    await User.create({ username, password });
    res.redirect("/login");
  } catch (err) {
    res.render("auth/register", { errors: [err.message] });
  }
};

exports.showLogin = (req, res) => {
  res.render("auth/login", { errors: [] });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const errors = [];
  if (!username || !password) {
    errors.push("Uzupełnij wszystkie pola");
    return res.render("auth/login", { errors });
  }

  const user = await User.findByUsername(username);
  if (!user || !User.validPassword(user, password)) {
    return res.render("auth/login", { errors: ["Nieprawidłowe dane logowania"] });
  }

  req.session.user = { id: user._id.toString(), username: user.username };
  res.redirect("/events");
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
