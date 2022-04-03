const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'name, age, and level are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'domo already exists' });
    }
    return res.status(400).json({ error: 'an error occurred' });
  }
};

const getDomos = (req, res) => Domo.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'an error occurred' });
  }

  return res.json({ domos: docs });
});

const deleteDomo = (req, res) => {
  Domo.deleteOne({ _id: req.body.id }, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occurred' });
    }

    return res.status(201).json({ message: 'domo deleted successfully' });
  });
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
