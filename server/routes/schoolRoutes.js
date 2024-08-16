const express = require("express");
const schoolController = require("../controller/schoolController.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

// verify jwt user
const verifyUser = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    const tokenRenewed = await renewToken(req, res);
    if (tokenRenewed) {
      return next();
    } else {
      return res.json({ valid: false, message: "No Access Token" });
    }
  } else {
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          return res.json({ valid: false, message: "Invalid Token" });
        } else {
          req.email = decoded.email;
          return next();
        }
      }
    );
  }
};

const renewToken = async (req, res) => {
  const refreshToken = req?.cookies?.refresh_token;
  let exist = false;
  if (!refreshToken) {
    return false;
  }
  //    else {
  //     jwt.verify(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET_KEY,
  //       (err, decoded) => {
  //         if (err) {
  //           return res.json({ valid: false, message: "Invalid Token" });
  //         } else {
  //           const accessToken = jwt.sign(
  //             { email: decoded.email },
  //             process.env.JWT_ACCESS_SECRET_KEY,
  //             { expiresIn: "1m" }
  //           );
  //           res.cookie("access_token", accessToken, { maxAge: 60000 });
  //           exist = true;
  //         }
  //       }
  //     );
  //   }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "1m" }
    );

    res.cookie("access_token", accessToken, { maxAge: 60000, httpOnly: true });
    return true; // Token renewed successfully
  } catch (err) {
    res.json({ valid: false, message: "Invalid Refresh Token" });
    return false;
  }
  // return exist;
};

router.route("/register").post(schoolController.register);
router.route("/login").post(schoolController.login);
router.route("/dashboard").get(verifyUser, schoolController.getDashboard);

module.exports = router;
// export default router;
