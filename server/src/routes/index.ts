import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Leads API is running' });
});

export default router;
