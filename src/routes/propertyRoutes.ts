import { Router } from 'express';
import { PropertyController } from '../controllers/propertyController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/search', authenticateJWT,  async (req, res, next) => {
  try {
    await PropertyController.searchProperties(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/search-contact', authenticateJWT ,async (req, res, next) => {
  try {
    await PropertyController.searchContacts(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateJWT, async (req, res, next) => {
  try {
    await PropertyController.getProperty(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticateJWT, async (req, res, next) => {
  try {
    await PropertyController.getProperties(req, res);
  } catch (error) {
    next(error);
  }
});

export const propertyRoutes = router;