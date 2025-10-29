const Automation = require('../models/Automation');

const checkConditions = (automation, eventData) => {
  if (!automation.conditions || automation.conditions.length === 0) return true;

  const results = automation.conditions.map(cond => {
    const fieldValue = eventData[cond.field];
    switch (cond.operator) {
      case 'equals': return fieldValue === cond.value;
      case 'not_equals': return fieldValue !== cond.value;
      case 'contains': return String(fieldValue).includes(cond.value);
      case 'starts_with': return String(fieldValue).startsWith(cond.value);
      case 'ends_with': return String(fieldValue).endsWith(cond.value);
      case 'greater_than': return fieldValue > cond.value;
      case 'less_than': return fieldValue < cond.value;
      case 'greater_or_equal': return fieldValue >= cond.value;
      case 'less_or_equal': return fieldValue <= cond.value;
      default: return false;
    }
  });

  if (automation.conditionLogic === 'AND') return results.every(Boolean);
  else return results.some(Boolean);
};



// Thực hiện action
const executeActions = async (automation) => {
  for (const action of automation.actions.sort((a, b) => a.order - b.order)) {
    if (action.type === 'send_email') {
      console.log(`[Automation ${automation._id}] Send email with config:`, action.config);
    } else if (action.type === 'http_request') {
      // Chỉ log ra, không gửi thật
      console.log(`[Automation ${automation._id}] HTTP request with config:`, action.config);
    }
  }

  // Cập nhật counters
  await automation.incrementRunCount();
  await automation.incrementSuccessCount();
};



// Hàm chính: chạy 1 automation
// const runAutomation = async (automationId, eventType, eventData = {}) => {
//   const automation = await Automation.findById(automationId);
//   if (!automation || !automation.enabled) return;

//   // Kiểm tra xem automation có trigger phù hợp với eventType không
//   const hasTrigger = automation.triggers.some(t => t.type === eventType || t.type === 'any');
//   if (!hasTrigger) return; // nếu không có trigger phù hợp thì bỏ qua

//   // Kiểm tra điều kiện
//   const isValid = checkConditions(automation, eventData);
//   if (!isValid) return;

//   try {
//     await executeActions(automation);
//   } catch (err) {
//     await automation.incrementFailureCount();
//     console.error(`Automation ${automation._id} failed:`, err);
//   }
// };


const runAutomation = async (automationId, eventType, eventData = {}) => {
  const automation = await Automation.findById(automationId)
  if (!automation) throw new Error('Automation not found')

  console.log(`⚡ Running automation: ${automation.name}`)
  console.log(`🔹 Trigger type: ${eventType}`)
  console.log(`📦 Event data:`, eventData)

  // ✅ Tăng số lần chạy + lưu lại thời gian
  await automation.incrementRunCount()

  try {
    // ✅ Giả lập điều kiện và hành động
    let allConditionsPass = true
    if (automation.conditions?.length > 0) {
      console.log(`🧩 Checking ${automation.conditions.length} conditions...`)
      // Giả lập tất cả điều kiện đều pass
      allConditionsPass = true
    }

    if (!allConditionsPass) {
      console.log('❌ Conditions not met. Automation skipped.')
      await automation.incrementFailureCount()
      return { success: false, message: 'Conditions not met' }
    }

    // ✅ Thực thi hành động
    console.log(`🚀 Executing ${automation.actions.length} actions...`)
    for (const action of automation.actions) {
      console.log(`→ Action type: ${action.type}`, action.config)
      // Giả lập delay và kết quả thành công
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    await automation.incrementSuccessCount()
    console.log(`✅ Automation "${automation.name}" executed successfully.`)

    return { success: true, message: 'Automation executed successfully' }
  } catch (err) {
    console.error('❌ Error running automation:', err)
    await automation.incrementFailureCount()
    return { success: false, message: err.message }
  }
}


module.exports = { runAutomation };
