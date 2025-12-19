const Event = require("../models/Event");

exports.list = async (req, res) => {
  const q = req.query.q || null;
  const category = req.query.category || null;
  const sortField = req.query.sort || "date";
  const order = req.query.order === "asc" ? 1 : -1;

  const filter = {};
  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) filter.category = category;

  const sort = {};
  sort[sortField] = order;

  const events = await Event.findAll({ filter, sort });
  const userId = req.session.user ? req.session.user.id : null;
  res.render("events/list", { events, q, category, sortField, order, userId });
};

exports.showCreate = (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("events/form", { event: {}, errors: [], formAction: "/events" });
};

exports.create = async (req, res) => {
  const { title, description, date, location, category } = req.body;
  const errors = [];
  if (!title || title.length < 3) errors.push("Tytuł minimalnie 3 znaki");
  if (errors.length) return res.render("events/form", { event: req.body, errors, formAction: "/events" });
  try {
    if (!req.session.user) return res.redirect("/login");
    await Event.create({ title, description, date, location, category, owner: req.session.user.id });
    res.redirect("/events");
  } catch (err) {
    res.render("events/form", { event: req.body, errors: [err.message], formAction: "/events" });
  }
};

exports.detail = async (req, res) => {
  const e = await Event.findById(req.params.id);
  if (!e) return res.status(404).render("errors/404", { message: "Wydarzenie nie znalezione" });
  const userId = req.session.user ? req.session.user.id : null;
  res.render("events/detail", { event: e, userId });
};

exports.showEdit = async (req, res) => {
  const e = await Event.findById(req.params.id);
  if (!e) return res.status(404).render("errors/404", { message: "Wydarzenie nie znalezione" });
  if (!req.session.user) return res.redirect("/login");
  if (!e.owner || e.owner.toString() !== req.session.user.id) return res.status(403).render('errors/404', { message: 'Brak uprawnień' });
  res.render("events/form", { event: e, errors: [], formAction: "/events/" + req.params.id + "/edit" });
};

exports.update = async (req, res) => {
  const { title, description, date, location, category } = req.body;
  const errors = [];
  if (!title || title.length < 3) errors.push("Tytuł minimalnie 3 znaki");
  if (errors.length) return res.render("events/form", { event: req.body, errors, formAction: "/events/" + req.params.id + "/edit" });
  const e = await Event.findById(req.params.id);
  if (!e) return res.status(404).render("errors/404", { message: "Wydarzenie nie znalezione" });
  if (!req.session.user) return res.redirect('/login');
  if (!e.owner || e.owner.toString() !== req.session.user.id) return res.status(403).render('errors/404', { message: 'Brak uprawnień' });
  await Event.update(req.params.id, { title, description, date, location, category });
  res.redirect("/events");
};

exports.remove = async (req, res) => {
  const e = await Event.findById(req.params.id);
  if (!e) return res.status(404).render("errors/404", { message: "Wydarzenie nie znalezione" });
  if (!req.session.user) return res.redirect('/login');
  if (!e.owner || e.owner.toString() !== req.session.user.id) return res.status(403).render('errors/404', { message: 'Brak uprawnień' });
  await Event.remove(req.params.id);
  res.redirect("/events");
};
