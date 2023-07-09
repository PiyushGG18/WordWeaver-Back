const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//Update
router.put("/:id", async function (req, res) {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("You can only update your own account");
  }
});


//Delete
router.delete("/:id", async function (req, res) {
  if (req.body.userId === req.params.id) {
    try {
      const user = User.findById(req.params.id);
      if(!user){
        res.status(404).json("User not found!");
      }else{
        await Post.deleteMany({username: user.username});
      }
      try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...");
      } catch (error) {
        res.status(500).json(error);
      }
      
    } catch (error) {
      
    }
  } else {
    res.status(401).json("You can only delete your own account");
  }
});

//Get User
router.get("/:id",async function(req,res){
  try {
      const user = await User.findById(req.params.id);
      const {password, ...others} = user._doc;
      res.status(200).json(others);
  } catch (e) {
      res.status(500).json(e);
  }
})

module.exports = router;
