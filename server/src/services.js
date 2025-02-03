function signup(req, res) {
  const { name } = req.body;

  if (!name) {
    res.status(500).send("name is required");
  }

  const isUser = global.users.get(name);

  if (isUser) {
    res.status(403).send("user already connected");
    return;
  }

  console.log(req.body);
  res.status(201).send("go with it");
}

function checkUser(req, res) {
  const { user } = req.query;
  if (!user) {
    res.status(500).send("invalid username");
    return;
  }

  const isUser = global.users.get(user);

  if (!isUser) {
    res.status(404).send("not found");
    return;
  }

  res.status(200).send("ok");
}

const services = {
  signup,
  checkUser,
};

module.exports = services;
