const cron = require('node-cron');
const Automation = require('./models/Automation');
const { runAutomation } = require('./services/automationService');

// Chạy mỗi phút (ví dụ) cho tất cả automation có trigger type = 'schedule'
cron.schedule('* * * * *', async () => {
  try {
    const automations = await Automation.find({ enabled: true, 'triggers.type': 'schedule' });
    for (const auto of automations) {
      await runAutomation(auto._id, 'schedule'); // eventType = 'schedule'
    }
  } catch (err) {
    console.error('Error running scheduled automations:', err);
  }
});
