const {
  createAutomation,
  getAutomations,
  getAutomationById,
  updateAutomation,
  deleteAutomation,
  updateAutomationStatus,
  testAutomation
} = require('../controllers/automationController');

async function AutomationRoutes(fastify, opts) {
  fastify.post('/api/automations', createAutomation);
  fastify.get('/api/automations', getAutomations);
  fastify.get('/api/automations/:id', getAutomationById);
  fastify.put('/api/automations/:id', updateAutomation);
  fastify.delete('/api/automations/:id', deleteAutomation);

  // ✅ Thêm route cập nhật trạng thái
  fastify.patch('/api/automations/:id/status', updateAutomationStatus);

    // Test automation
  fastify.post('/api/automations/:id/test', testAutomation);
}

module.exports = AutomationRoutes;
