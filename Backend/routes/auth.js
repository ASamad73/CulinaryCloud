


// --------------
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const passport = require("passport");
const User = require("../models/User"); // Adjust the path as needed
const cloudinary = require("../utils/cloudinary");

require("../middleware/passportConfig");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}); // 10MB

// Helper to upload image buffer to Cloudinary
const uploadToCloudinary = async (file) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  return await cloudinary.uploader.upload(dataURI, {
    folder: "user-profiles",
    width: 500,
    height: 500,
    crop: "fill",
  });
};

/* Google Authentication Routes */

// Route to start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   (req, res) => {
//     console.log("Google Profile:", req.user);

//     // After successful Google authentication, generate a JWT token.
//     const payload = { user: { id: req.user._id } };
//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

//     // Redirect the user to your frontend Dashboard with the token as a query parameter.
//     res.redirect(${process.env.FRONTEND_URL}/dashboard?token=${token});

//   }
// );

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   async (req, res) => {
//     try {
//       const profile = req.user;
//       const email   = profile.emails[0].value;
//       const googleId = profile.id;
//       const photo    = profile.photos[0]?.value || '';

//       // Find or create the user
//       let user = await User.findOne({ email });

//       if (!user) {
//         user = new User({
//           email,
//           name:           email.split('@')[0],      // <— username = before '@'
//           profilePicture: photo,
//           auth: { google: { id: googleId } }
//         });
//         await user.save();
//       } else {
//         // Ensure any missing fields get populated
//         let changed = false;
//         if (!user.auth.google?.id) {
//           user.auth.google = { id: googleId };
//           changed = true;
//         }
//         if (!user.name) {
//           user.name = email.split('@')[0];
//           changed = true;
//         }
//         if (!user.profilePicture && photo) {
//           user.profilePicture = photo;
//           changed = true;
//         }
//         if (changed) await user.save();
//       }

//       // Issue JWT and redirect back to frontend
//       const payload = { user: { id: user._id } };
//       const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

//       res.redirect(${process.env.FRONTEND_URL}/dashboard?token=${token});
//     } catch (err) {
//       console.error('[Google OAuth Error]', err);
//       res.status(500).send('Authentication failed');
//     }
//   }
// );

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    // At this point passportConfig has created/found the User and set req.user
    const payload = { user: { id: req.user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    // Redirect back to your React app with the JWT
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   async (req, res) => {
//     try {
//       console.log("Google Profile:", req.user);
//       const googleProfile = req.user;

//       const email = googleProfile.emails[0].value;
//       const name = googleProfile.displayName;
//       const profilePicture = googleProfile.photos[0]?.value || '';
//       const googleId = googleProfile.id;

//       // Find user by email
//       let user = await User.findOne({ email });

//       if (!user) {
//         // Create new user if not found
//         user = new User({
//           email,
//           name,
//           profilePicture,
//           auth: {
//             google: {
//               id: googleId
//             }
//           }
//         });
//         await user.save();
//       } else {
//         // Update user with Google ID and profile info if not already stored
//         let needsUpdate = false;

//         if (!user.auth?.google?.id) {
//           user.auth.google = { id: googleId };
//           needsUpdate = true;
//         }

//         if (!user.name && name) {
//           user.name = name;
//           needsUpdate = true;
//         }

//         if (!user.profilePicture && profilePicture) {
//           user.profilePicture = profilePicture;
//           needsUpdate = true;
//         }

//         if (needsUpdate) {
//           await user.save();
//         }
//       }

//       // Generate JWT for the user
//       const payload = { user: { id: user._id } };
//       const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

//       res.redirect(${process.env.FRONTEND_URL}/dashboard?token=${token});
//     } catch (err) {
//       console.error('[Google OAuth Error]', err);
//       res.status(500).send('Authentication failed');
//     }
//   }
// );

/* --- Local Registration Route --- */
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { firstName,lastName, email, password, bio, name } = req.body;

  let dietaryPreferences = [];
  try {
    dietaryPreferences = req.body.dietaryPreferences
      ? JSON.parse(req.body.dietaryPreferences)
      : [];
  } catch {
    return res.status(400).json({ msg: "Invalid dietary preferences format" });
  }
  // Basic validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profilePicture = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      profilePicture = result.secure_url;
    }

    user = new User({
      email,
      name:firstName,
      lname:lastName,
      auth: {
        local: { password: hashedPassword },
      },
      profilePicture,
      dietaryPreferences,
      bio,
    });

    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({ msg: "User registered successfully", token });
  } catch (err) {
    if (err.name === "ValidationError") {
      let errorMessage = "Validation error";
      if (err.errors?.email) {
        errorMessage = err.errors.email.message;
      }
      return res.status(400).json({ msg: errorMessage });
    }

    console.error("[Register Error]", err);
    res.status(500).send("Server error");
  }
});

/* --- Local Login Route --- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.auth?.local?.password) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.auth.local.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("[Login Error]", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;