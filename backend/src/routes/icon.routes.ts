import { Router } from 'express';
import https from 'https';

const router = Router();

const WOWHEAD_ICON_URL = 'https://wow.zamimg.com/images/wow/icons/medium';

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const url = `${WOWHEAD_ICON_URL}/${name}`;

  https
    .get(url, { timeout: 5000 }, (response) => {
      if (response.statusCode !== 200) {
        res.status(404).end();
        return;
      }

      res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      response.pipe(res);
    })
    .on('error', () => {
      res.status(404).end();
    });
});

export default router;
