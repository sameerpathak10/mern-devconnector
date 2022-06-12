const express = require("express");
const router = express.Router();
//const axios = require("axios");
const request = require("request");
const config = require("config");

const { check, validationResult } = require("express-validator");
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require("normalize-url");
const checkObjectId = require("../../middleware/checkObjectId");
const Profile = require("../../models/ProfileModel");
const User = require("../../models/UserModel");
const auth = require("../../middleware/auth");
const Post = require("../../models/PostModel");

// @route   GET api/profiles/me
// @desc    Get logged in user's profile
// @access  Public

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    return res.json(profile);
  } catch (err) {
    //console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route   POST api/profiles/
// @desc    Create or update user profile
// @access  Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are mandatory.").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

    //social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Insert new profile
      profile = new Profile(profileFields);
      await profile.save();

      return res.json(profile);
    }catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
  }
);

// @route   GET api/profiles
// @desc    Get all user profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    if (!profiles) {
      return res.status(400).json("No profile found.");
    }
    return res.json(profiles);
  } catch (error) {
    console.error(err.message);
    return res.status(500).json(`Server Error: ${error.message}`);
  }
});

// @route   GET api/profiles/user/:user_id
// @desc    Get profile by user id
// @access  Public

router.get(
  "/user/:user_id", 
  checkObjectId('user_id'),
  async ({ params: { user_id }}, res) => {
  try {
    const profile = await Profile.findOne({ 
      user: req.params.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json("Profile not found.");
    }

    return res.json(profile);
  } catch (error) {
    console.error(err.message);
    return res.status(500).json(`Server Error: ${error.message}`);
  }
});

// @route   DELETE api/profiles
// @desc    Delete profile,user and post
// @access  Public

router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      Post.deleteMany({ user: req.user.id }),
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id })
    ]);

    return res.json("User and its profile deleted.");
  } catch (error) {
    return res.status(500).json(`Server Error: ${error.message}`);
  }
});

// @route   PUT api/profiles/experience
// @desc    Add/ update experience in user's profile
// @access  Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required.").not().isEmpty(),
      check("company", "Company name is required.").not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  async (req, res) => {
    var validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({ errors: validationError.array() });
    }

    const { title, company, from, to, current, description } = req.body;

    const newExperience = { title, company, from, to, current, description };

    try {
      var profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(400).json("Profile doesn't exists");
      }
      profile.experience.unshift(newExperience);
      await profile.save();

      return res.json(profile);
    } catch (error) {
      console.error(err.message);
      return res.status(500).json(`Server Error: ${error.message}`);
    }
  }
);

// @route   DELETE api/profiles/experience
// @desc    delete experience from user's profile
// @access  Private

router.delete("/experience/:experience_id", auth, async (req, res) => {
  try {
    var profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json("Profile not found");
    }
    //Get Id of experience
    var removeExpId = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.experience_id);

    profile.experience.splice(removeExpId, 1);
    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.error(err.message);
    return res.status(500).json(`Server Error: ${error.message}`);
  }
});

// @route   PUT api/profiles/education
// @desc    Add/ update education in user's profile
// @access  Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required.").not().isEmpty(),
      check("degree", "Degree is required.").not().isEmpty(),
      check("fieldofstudy", "Field of study is required.").not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  async (req, res) => {
    var validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({ errors: validationError.array() });
    }

    const { school, degree, from, fieldofstudy, to, current, description } =
      req.body;

    const newEducation = {
      school,
      degree,
      from,
      fieldofstudy,
      to,
      current,
      description,
    };

    try {
      var profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(400).json("Profile doesn't exists");
      }
      profile.education.unshift(newEducation);
      await profile.save();

      return res.json(profile);
    } catch (error) {
      console.error(err.message);
      return res.status(500).json(`Server Error: ${error.message}`);
    }
  }
);

// @route   DELETE api/profiles/education
// @desc    delete education from user's profile
// @access  Private

router.delete("/education/:education_id", auth, async (req, res) => {
  try {
    var profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json("Profile not found");
    }
    //Get Id of education
    var removeEduId = profile.education
      .map((item) => item.id)
      .indexOf(req.params.education_id);

    profile.education.splice(removeEduId, 1);
    await profile.save();

    return res.json(profile);
  } catch (error) {
    return res.status(500).json(`Server Error: ${error.message}`);
  }
});

// @route   GET api/profiles/github/:username
// @desc    Get github repos of users
// @access  Public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "gitHubClientId"
      )}&client_scret=${config.get("gitHubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode != 200) {
        return res.status(404).json({ msg: "No GitHub profile found" });
      }

      return res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(err.message);
    return res.status(500).json(`Server Error: ${error.message}`);
  }
});
module.exports = router;
