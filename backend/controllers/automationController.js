const Automation = require('../models/Automation');
const { runAutomation } = require('../services/automationService');

// === Tạo mới Automation ===
exports.createAutomation = async (request, reply) => {
  try {
    const automation = await Automation.create(request.body);
    reply.code(201).send({
      success: true,
      message: 'Automation created successfully',
      data: automation
    });
  } catch (error) {
    reply.code(400).send({ success: false, message: error.message });
  }
};

// === Lấy danh sách Automation ===
exports.getAutomations = async (request, reply) => {
  try {
    const automations = await Automation.find().sort({ createdAt: -1 });
    reply.send({
      success: true,
      count: automations.length,
      data: automations
    });
  } catch (error) {
    reply.code(500).send({ success: false, message: error.message });
  }
};

// === Lấy chi tiết 1 Automation ===
exports.getAutomationById = async (request, reply) => {
  try {
    const { id } = request.params;
    const automation = await Automation.findById(id);
    if (!automation) {
      return reply.code(404).send({ success: false, message: 'Automation not found' });
    }
    reply.send({ success: true, data: automation });
  } catch (error) {
    reply.code(400).send({ success: false, message: 'Invalid ID' });
  }
};

// === Cập nhật Automation ===
exports.updateAutomation = async (request, reply) => {
  try {
    const { id } = request.params;
    const updated = await Automation.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });
    if (!updated) {
      return reply.code(404).send({ success: false, message: 'Automation not found' });
    }
    reply.send({ success: true, message: 'Updated successfully', data: updated });
  } catch (error) {
    reply.code(400).send({ success: false, message: error.message });
  }
};

// === Xóa Automation ===
exports.deleteAutomation = async (request, reply) => {
  try {
    const { id } = request.params;
    const deleted = await Automation.findByIdAndDelete(id);
    if (!deleted) {
      return reply.code(404).send({ success: false, message: 'Automation not found' });
    }
    reply.send({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    reply.code(400).send({ success: false, message: error.message });
  }
};


// === Cập nhật trạng thái Automation ===
exports.updateAutomationStatus = async (request, reply) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    if (typeof status === 'undefined') {
      return reply.code(400).send({ success: false, message: 'Status is required' });
    }

    const automation = await Automation.findById(id);
    if (!automation) {
      return reply.code(404).send({ success: false, message: 'Automation not found' });
    }

    if (!automation.name || !automation.triggers.length || !automation.actions.length) {
      return reply.code(400).send({
        success: false,
        message: 'Cannot update status: Automation must have a title, at least one trigger, and at least one action'
      });
    }

    automation.enabled = status;
    await automation.save();

    reply.send({
      success: true,
      message: 'Status updated successfully',
      data: automation
    });
  } catch (error) {
    reply.code(400).send({ success: false, message: error.message });
  }
};


// === Test 1 Automation (chạy thử từ giao diện) ===
exports.testAutomation = async (request, reply) => {
  try {
    const { id } = request.params;
    const { eventData } = request.body;

    const automation = await Automation.findById(id);
    if (!automation) {
      return reply.code(404).send({ success: false, message: 'Automation not found' });
    }
    await runAutomation(id, 'any', eventData || {});

    reply.send({ success: true, message: 'Automation test executed (check console logs)' });
  } catch (error) {
    reply.code(500).send({ success: false, message: error.message });
  }
};

