import { Router } from 'express';
import { OwnerController } from '../controllers/ownerController';
import { authenticateJWT, checkRole } from '../middleware/auth';

const router = Router();

router.get('/:propertyId', authenticateJWT, async (req, res, next) => {
  try {
    await OwnerController.getOwners(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/:propertyId', authenticateJWT, checkRole(['admin']), async (req, res, next) => {
  try {
    await OwnerController.createOwner(req, res);
  } catch (error) {
    next(error);
  }
});

export const ownerRoutes = router;