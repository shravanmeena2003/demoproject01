import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
  getStats,
} from '../controllers/lead.controller';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
  leadIdSchema,
} from '../validators/lead.validator';
import { UserRole } from '../constants';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/export', validate(leadQuerySchema, 'query'), exportLeads);
router.get('/', validate(leadQuerySchema, 'query'), getLeads);
router.get('/:id', validate(leadIdSchema, 'params'), getLead);
router.post('/', validate(createLeadSchema), createLead);
router.patch('/:id', validate(leadIdSchema, 'params'), validate(updateLeadSchema), updateLead);
router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(leadIdSchema, 'params'),
  deleteLead
);

export default router;
