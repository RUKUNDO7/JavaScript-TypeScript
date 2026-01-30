const mongoose = require('mongoose');
const Member = require ('../models/memberModel');
const memberValidator = require('../models/memberModel');
const {Profile , profileValidator} = require ('../models/profileModel');
const  { sign } = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { addProfileUrls } = require('../utils/urlHelper');
const { uploadToCloudinary, isCloudinaryConfigured } = require('../utils/cloudinary');
const { wishValidator, Wish } = require('../models/wishModel');

const login = async (req,res)=>{
  const { userType, familyName } = req.body;

  if (!userType || !['guest', 'member'].includes(userType)) {
    return res.status(400).json({message: 'Please specify userType as either "guest" or "member"'});
  }

  if (userType === 'guest') {
    const guestToken = sign(
      { 
        role: 'guest', 
        name: 'Guest User',
        userType: 'guest'
      }, 
      process.env.JWTSECRETKEY,
      { expiresIn: '24h' }
    );
    return res.setHeader('Authorization', `Bearer ${guestToken}`).json({ token: guestToken, role: 'guest',message: 'Welcome as a guest! You have limited access to features.'});
  }

  if (userType === 'member') {
    const {error} = memberValidator.validate({familyName});
    if(error){
      return res.status(400).json({message:error.details[0].message})
    }

    if(!familyName) {
      return res.status(400).json({message: 'Family name is required for member login'});
    }

    const familyNameUpper = familyName.toUpperCase();
    const allowedFamilyNames = process.env.FAMILYNAMES.split(',').map(e => e.trim().toUpperCase());
    const allowedAdminNames = process.env.ADMINNAMES ? process.env.ADMINNAMES.split(',').map(e => e.trim().toUpperCase()) : [];


    if (allowedAdminNames.includes(familyNameUpper)) {
      const adminToken = sign(
        {
          name: familyName,
          role: 'admin',
          userType: 'admin'
        },
        process.env.JWTSECRETKEY,
        { expiresIn: '7d' }
      );
      return res.setHeader('Authorization',`Bearer ${adminToken}`)
                .json({
                  token: adminToken,
                  role: 'admin',
                  message: `Welcome back, Admin ${familyName}!`
                });
    }
    // Check if user is a regular member
    else if (allowedFamilyNames.includes(familyNameUpper)) {
      const memberToken = sign(
        {
          name: familyName,
          role: 'member',
          userType: 'member'
        },
        process.env.JWTSECRETKEY,
        { expiresIn: '7d' }
      );
      return res.setHeader('Authorization',`Bearer ${memberToken}`)
                .json({
                  token: memberToken,
                  role: 'member',
                  message: `Welcome back, ${familyName}!`
                });
    } else {
      return res.status(401).json({message:'Invalid family name. Please check your credentials or login as a guest.'});
    }
  }
}

const profile = async (req,res)=>{
  console.log('Profile creation request body:', req.body);
  console.log('Profile creation file:', req.file);
  
  const familyName = req.user?.name;
  if (!familyName) {
    return res.status(400).json({message: 'Family name not found in token'});
  }
  
  const existingProfile = await Profile.findOne({ familyName: familyName.toUpperCase() });
  if (existingProfile) {
    return res.status(400).json({message: 'Profile already exists for this family'});
  }
  
  const profileData = {
    ...req.body,
    familyName: familyName.toUpperCase()
  };

  if (req.file) {
    if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({message: 'Only image files are allowed for profilePic'});
    }
    
    try {
      if (isCloudinaryConfigured()) {
        console.log('Uploading image to Cloudinary...');
        const cloudinaryUrl = await uploadToCloudinary(req.file.path);
        profileData.profilePic = cloudinaryUrl;
        console.log('Cloudinary URL:', cloudinaryUrl);
      } else {
        console.warn('Cloudinary not configured, using local storage');
        profileData.profilePic = `images/${req.file.filename}`;
      }
    } catch (uploadError) {
      console.error('Image upload failed:', uploadError);
      return res.status(500).json({message: 'Failed to upload profile picture'});
    }
  }

  if (!req.file && typeof profileData.profilePic === 'string') {
    const trimmed = profileData.profilePic.trim();
    if (!trimmed) {
      return res.status(400).json({message: 'profilePic must not be empty'});
    }
    const isAbsoluteUrl = /^https?:\/\//i.test(trimmed);
    if (!isAbsoluteUrl) {
      return res.status(400).json({message: 'profilePic must be an absolute URL (https://...) when no file is uploaded'});
    }
  }
  
  const {error} = profileValidator.validate(profileData)
  if(error){
    console.log('Validation error:', error.details[0].message);
    return res.status(400).json({message:error.details[0].message})
  }

  try {
    const newProfile = new Profile(profileData);
    const saved = await newProfile.save()
    console.log('Profile saved successfully:', saved);
    
    const profileWithUrls = addProfileUrls(saved, req);
    
    return res.status(200).json({data: profileWithUrls})
  } catch (error) {
    console.error('Profile save error:', error);
    return res.status(500).json({message: error.message || 'Failed to create profile'})
  }
}

const birthdays = async (req,res)=>{
  
 try {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;

  const bdkids = await Profile.find({
    $expr:{
      $and:[
        {$eq:[{$dayOfMonth:"$birthday"},date]},
        {$eq:[{$month:"$birthday"},month] }
      ]
    }
  })
  if(bdkids.length === 0){
    return res.json({message:"No one has a bd today"})
  }
  const birthdayNames = bdkids.map(i => i.name).join(", ");
  
  // Send emails asynchronously (non-blocking)
  const sendBirthdayEmails = async () => {
    try {
      const allProfiles = await Profile.find({}, "email name");
      const subject = "🎉 Birthday Alert!";
      const message = `Today we celebrate ${birthdayNames}'s birthday! 🎂🥳\n\nDon't forget to send your wishes!`;

      const emailPromises = allProfiles
        .filter(user => user.email)
        .map(user => sendEmail(user.email, subject, message).catch(error => {
          console.error(`Failed to send email to ${user.email}:`, error.message);
          return null; // Don't throw, just log the error
        }));

      await Promise.allSettled(emailPromises);
      console.log('Birthday emails sent successfully');
    } catch (error) {
      console.error('Error sending birthday emails:', error.message);
    }
  };

  // Start email sending in background (don't wait for it)
  sendBirthdayEmails();

  // Return response immediately
  return res.json({
    message: `Found ${birthdayNames} celebrating today! Birthday notifications are being sent.`,
    birthdays: bdkids.map((i) => ({
      name: i.name
    }))
  })

 } catch (error) {
  res.json({message:error.message || "Failed to fetch birthdays"})
 }
}

const checkProfile = async (req, res) => {
  try {
    const familyName = req.user?.name; 
    
    if (!familyName) {
      return res.status(400).json({ message: 'Family name not found in token' });
    }
    
    console.log('Checking profile for family:', familyName);
    
    const profile = await Profile.findOne({
      familyName: familyName.toUpperCase()
    });
    
    if (profile) {
      const profileWithUrls = addProfileUrls(profile, req);
      
      return res.status(200).json({
        hasProfile: true,
        profile: profileWithUrls
      });
    } else {
      return res.status(200).json({
        hasProfile: false
      });
    }
    
  } catch (error) {
    console.error('Profile check error:', error);
    return res.status(500).json({ message: 'Failed to check profile' });
  }
};

const getProfile = async (req, res) => {
  try {
    const familyName = req.user?.name;
    
    if (!familyName) {
      return res.status(400).json({ message: 'Family name not found in token' });
    }
    
    console.log('Getting profile for you:', familyName);
    
    const profile = await Profile.findOne({
      familyName: familyName.toUpperCase()
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const profileWithUrls = addProfileUrls(profile, req);
    
    return res.status(200).json({
      success: true,
      data: profileWithUrls
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Failed to get profile' });
  }
};

const upcomingBirthdays = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    console.log('Searching for birthdays between:', today.toDateString(), 'and', thirtyDaysFromNow.toDateString());
    
    const allProfiles = await Profile.find({});
    
    const upcomingBirthdays = [];
    
    allProfiles.forEach(profile => {
      const birthday = new Date(profile.birthday);
      
      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
      
      const nextYearBirthday = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
      
      let daysUntilBirthday;
      let birthdayThisYear = thisYearBirthday;
      
      if (thisYearBirthday >= today && thisYearBirthday <= thirtyDaysFromNow) {
        daysUntilBirthday = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
        birthdayThisYear = thisYearBirthday;
      }
      else if (nextYearBirthday >= today && nextYearBirthday <= thirtyDaysFromNow) {
        daysUntilBirthday = Math.ceil((nextYearBirthday - today) / (1000 * 60 * 60 * 24));
        birthdayThisYear = nextYearBirthday;
      }
      
      if (daysUntilBirthday !== undefined) {
        const currentAge = today.getFullYear() - birthday.getFullYear();
        const ageTheyWillTurn = birthdayThisYear.getFullYear() - birthday.getFullYear();
        
        const profileWithUrls = addProfileUrls(profile, req);
        
        upcomingBirthdays.push({
          _id: profile._id,
          name: profile.name,
          familyName: profile.familyName,
          email: profile.email,
          subFam: profile.subFam,
          profilePicUrl: profileWithUrls.profilePicUrl,
          birthday: profile.birthday,
          birthdayThisYear: birthdayThisYear,
          daysUntilBirthday: daysUntilBirthday,
          ageTheyWillTurn: ageTheyWillTurn,
          birthdayFormatted: birthdayThisYear.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
      }
    });
    
    upcomingBirthdays.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
    
    console.log(`Found ${upcomingBirthdays.length} upcoming birthdays`);
    
    return res.status(200).json({
      success: true,
      message: upcomingBirthdays.length > 0 
        ? `Found ${upcomingBirthdays.length} upcoming birthday${upcomingBirthdays.length === 1 ? '' : 's'} in the next 30 days`
        : "No birthdays in the next 30 days",
      count: upcomingBirthdays.length,
      upcomingBirthdays: upcomingBirthdays
    });
    
  } catch (error) {
    console.error('Upcoming birthdays error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch upcoming birthdays' 
    });
  }
};

const wish  = async (req, res) => {
  
  const {text} = req.body;

  const { error } = wishValidator.validate(req.body)
  if (error) {
    console.log('Validation error:', error.details[0].message);
    return res.status(400).json({ message: error.details[0].message })
  }


  const wishData = {
    sender: req.user.name,
    text: req.body.text
  }

  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const profiles = await Profile.find({});
    const hasBirthdayTodayOrUpcoming = profiles.some(profile => {
      const birthday = new Date(profile.birthday);
      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
      const nextYearBirthday = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());

      const isBirthdayToday = today.getDate() === birthday.getDate() && today.getMonth() === birthday.getMonth();

      let daysUntilBirthday;
      if (thisYearBirthday >= today) {
        daysUntilBirthday = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
      } else {
        daysUntilBirthday = Math.ceil((nextYearBirthday - today) / (1000 * 60 * 60 * 24));
      }
      const isUpcomingBirthday = daysUntilBirthday >= 0 && daysUntilBirthday <= 30;

      return isBirthdayToday || isUpcomingBirthday;
    });

    if (!hasBirthdayTodayOrUpcoming) {
      return res.status(400).json({ message: 'No birthdays today or in the next 30 days. Wishes can only be posted for those occasions.' });
    }

    const wish = new Wish({ 
      text: wishData.text,
      sender: wishData.sender,
    });
    const saved = await wish.save();
    return res.status(200).json({ data: saved });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getWishes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (page < 1) {
      return res.status(400).json({ message: 'Page number must be greater than 0' });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    const totalWishes = await Wish.countDocuments();
    
    const wishes = await Wish.find({}, 'text sender profilePic createdAt')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalWishes / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      wishes,
      pagination: {
        currentPage: page,
        totalPages,
        totalWishes,
        wishesPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (page < 1) {
      return res.status(400).json({ message: 'Page number must be greater than 0' });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    const totalUsers = await Profile.countDocuments();
    
    const users = await Profile.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const usersWithUrls = users.map(user => addProfileUrls(user, req));

    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      message: `Retrieved ${usersWithUrls.length} users`,
      count: usersWithUrls.length,
      totalUsers,
      users: usersWithUrls,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        usersPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to retrieve users' 
    });
  }
}

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const existingUser = await Profile.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await Profile.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: `User ${existingUser.name} (${existingUser.familyName}) has been successfully deleted`,
      deletedUser: {
        id: existingUser._id,
        name: existingUser.name,
        familyName: existingUser.familyName,
        email: existingUser.email
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
}

const getUser = async (req, res) => {

  const userId = req.params.id;

  if(!userId){
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    })
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  const user = await Profile.findById(userId);
  if(!user){
    return res.status(400).json({
      success: false,
      message: 'User not found!'
    })
  }
  return res.status(200).json({
    success: true,
    message: 'User Found',
    profilePic: user.profilePic,
    familyName: user.familyName,
    name: user.name,
    email: user.email
  })

}


const updateProfile = async (req, res) => {
  try {
    const familyName = req.user?.name;
    
    if (!familyName) {
      return res.status(400).json({
        success: false,
        message: 'Family name not found in token'
      });
    }

    // Find user by family name
    const existingUser = await Profile.findOne({ familyName: familyName.toUpperCase() });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create a profile first.'
      });
    }

    // Prepare update data
    const updateData = {
      ...req.body
    };

    // Handle profile picture update
    if (req.file) {
      if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          message: 'Only image files are allowed for profilePic'
        });
      }
      
      try {
        if (isCloudinaryConfigured()) {
          console.log('Uploading updated image to Cloudinary...');
          const cloudinaryUrl = await uploadToCloudinary(req.file.path);
          updateData.profilePic = cloudinaryUrl;
          console.log('Updated Cloudinary URL:', cloudinaryUrl);
        } else {
          console.warn('Cloudinary not configured, using local storage');
          updateData.profilePic = `images/${req.file.filename}`;
        }
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload profile picture'
        });
      }
    }

    // Handle profile picture URL validation if provided as string
    if (!req.file && typeof updateData.profilePic === 'string') {
      const trimmed = updateData.profilePic.trim();
      if (!trimmed) {
        return res.status(400).json({
          success: false,
          message: 'profilePic must not be empty'
        });
      }
      const isAbsoluteUrl = /^https?:\/\//i.test(trimmed);
      if (!isAbsoluteUrl) {
        return res.status(400).json({
          success: false,
          message: 'profilePic must be an absolute URL (https://...) when no file is uploaded'
        });
      }
    }

    // Validate the update data
    const { error } = profileValidator.validate(updateData);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Update the user
    const updatedUser = await Profile.findByIdAndUpdate(
      existingUser._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found after update attempt'
      });
    }

    const userWithUrls = addProfileUrls(updatedUser, req);

    return res.status(200).json({
      success: true,
      message: `Your profile has been successfully updated`,
      data: userWithUrls,
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
}

// Function to delete all wishes (for daily cleanup)
const deleteAllWishes = async () => {
  try {
    const result = await Wish.deleteMany({});
    console.log(`Daily cleanup: Deleted ${result.deletedCount} wishes`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error deleting wishes:', error);
    throw error;
  }
}

module.exports = {login,profile,birthdays,checkProfile,getProfile,upcomingBirthdays,wish, getWishes, getAllUsers, deleteUser, getUser, updateProfile, deleteAllWishes}

