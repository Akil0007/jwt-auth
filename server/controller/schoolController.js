const studentModel = require("../model/Student");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("data", name, email, password);
  studentModel
    .create({ name, email, password })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  studentModel
    .findOne({ email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          const accessToken = jwt.sign(
            { email: email },
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: "1m" }
          );
          const refreshToken = jwt.sign(
            { email: email },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: "3m" }
          );

          res.cookie("access_token", accessToken, { maxAge: 60000 });
          res.cookie("refresh_token", refreshToken, {
            maxAge: 300000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          });
          return res.json({ Login: true });
        }
        return res.json(user);
      } else {
        return res.json({ Login: false, Message: "No Record Existed " });
      }
    })
    .catch((err) => res.json(err));
};

exports.getDashboard = async (req, res) => {
  return res.json({ valid: true, message: "Authorized" });
};
