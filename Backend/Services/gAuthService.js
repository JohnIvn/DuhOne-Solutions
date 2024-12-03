import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const siteKey = process.env.RECAPTCHA_SITE_KEY;
    res.json({ siteKey });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

export default router;
