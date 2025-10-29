const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    { expiresIn: '7d' }
  );
};

// Xử lý Google OAuth callback
const handleGoogleCallback = async (profile) => {
  try {
    // Tìm hoặc tạo user
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Kiểm tra xem email đã tồn tại chưa
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Update user với Google ID
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value || user.avatar;
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Tạo user mới
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          provider: 'google',
          lastLogin: new Date(),
        });
      }
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    return { user, token };
  } catch (error) {
    console.error('Error in handleGoogleCallback:', error);
    throw error;
  }
};

// Get current user từ token
const getCurrentUser = async (request, reply) => {
  try {
    const token = request.cookies.token;

    if (!token) {
      return reply.status(401).send({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    );

    // Get user
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user) {
      return reply.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    return reply.send({
      success: true,
      user,
    });
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: 'Invalid token',
    });
  }
};

// Logout
const logout = async (request, reply) => {
  try {
    reply.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.wedly.info' : undefined,
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: 'Logout failed',
    });
  }
};

module.exports = {
  generateToken,
  handleGoogleCallback,
  getCurrentUser,
  logout,
};
