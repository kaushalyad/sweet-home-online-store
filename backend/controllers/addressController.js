import Address from '../models/addressModel.js';
import logger from '../config/logger.js';

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      addresses
    });
  } catch (error) {
    logger.error('Error fetching addresses:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses"
    });
  }
};

// Add a new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, street, city, state, zipcode, country, label, isDefault } = req.body;

    const address = await Address.create({
      userId,
      name,
      phone,
      street,
      city,
      state,
      zipcode,
      country,
      label,
      isDefault
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address
    });
  } catch (error) {
    logger.error('Error adding address:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to add address"
    });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { name, phone, street, city, state, zipcode, country, label, isDefault } = req.body;

    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      {
        name,
        phone,
        street,
        city,
        state,
        zipcode,
        country,
        label,
        isDefault
      },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address
    });
  } catch (error) {
    logger.error('Error updating address:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to update address"
    });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });
  } catch (error) {
    logger.error('Error deleting address:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete address"
    });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      address
    });
  } catch (error) {
    logger.error('Error setting default address:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to set default address"
    });
  }
}; 