import SharedContent from '../models/sharedContent.js';
import { v4 as uuidv4 } from 'uuid';
// import logger from '../utils/logger.js';

// Create shared content
export const createSharedContent = async (req, res) => {
  try {
    const { title, content, type, referenceId } = req.body;
    const contentId = uuidv4();

    const sharedContent = await SharedContent.create({
      contentId,
      title,
      content,
      type,
      referenceId,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: {
        contentId: sharedContent.contentId,
        title: sharedContent.title,
        type: sharedContent.type,
        createdAt: sharedContent.createdAt
      }
    });
  } catch (error) {
    // logger.error(`Error creating shared content: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create shared content'
    });
  }
};

// Get shared content by ID
export const getSharedContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const sharedContent = await SharedContent.findOne({
      contentId,
      isActive: true
    });

    if (!sharedContent) {
      return res.status(404).json({
        success: false,
        message: 'Shared content not found'
      });
    }

    res.json({
      success: true,
      content: {
        title: sharedContent.title,
        content: sharedContent.content,
        type: sharedContent.type,
        referenceId: sharedContent.referenceId,
        createdAt: sharedContent.createdAt
      }
    });
  } catch (error) {
    logger.error(`Error fetching shared content: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shared content'
    });
  }
};

// Delete shared content
export const deleteSharedContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const sharedContent = await SharedContent.findOne({
      contentId,
      createdBy: req.user._id
    });

    if (!sharedContent) {
      return res.status(404).json({
        success: false,
        message: 'Shared content not found'
      });
    }

    sharedContent.isActive = false;
    await sharedContent.save();

    res.json({
      success: true,
      message: 'Shared content deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting shared content: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shared content'
    });
  }
}; 