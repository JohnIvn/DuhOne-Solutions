app.get('/api/getString', (req, res) => {
    res.json({ string: process.env.GAUTH_SITE_KEY });
});