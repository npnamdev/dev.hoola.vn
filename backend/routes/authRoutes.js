const passport = require('passport');
const { handleGoogleCallback, getCurrentUser, logout } = require('../controllers/authController');

async function authRoutes(fastify, options) {
  // Khởi tạo Google OAuth - Redirect đến Google
  fastify.get('/auth/google', async (request, reply) => {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=profile email`;

    return reply.redirect(redirectUrl);
  });

  // Google OAuth callback
  fastify.get('/auth/google/callback', async (request, reply) => {
    try {
      const { code } = request.query;

      if (!code) {
        return reply.status(400).send({
          success: false,
          message: 'Authorization code not found',
        });
      }

      // Exchange code cho access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        throw new Error('Failed to get access token');
      }

      // Lấy thông tin user từ Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      const googleUser = await userInfoResponse.json();

      // Tạo profile object tương tự passport
      const profile = {
        id: googleUser.id,
        displayName: googleUser.name,
        emails: [{ value: googleUser.email }],
        photos: [{ value: googleUser.picture }],
      };

      // Xử lý callback và tạo user
      const { user, token } = await handleGoogleCallback(profile);

      // Set cookie
      reply.setCookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        domain: '.wedly.info',
        maxAge: 7 * 24 * 60 * 60
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // path: '/',
        // sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
        // domain: process.env.NODE_ENV === 'production' ? '.wedly.info' : undefined,
        // maxAge: 7 * 24 * 60 * 60,
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return reply.redirect(`${frontendUrl}/google-auth-callback?login=success`);

    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return reply.redirect(`${frontendUrl}/google-auth-callback?login=error`);
    }
  });

  // Get current user
  fastify.get('/auth/me', getCurrentUser);

  // Logout
  fastify.post('/auth/logout', logout);
}

module.exports = authRoutes;
