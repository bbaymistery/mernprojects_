const UserAddress = require("../models/address");

/**
 * Adds a new shipping address or updates an existing address in the user's address book.
 * @route POST /api/user/address/create
 * @param {Object} req.body.payload - { address: { _id?, name, mobileNumber, pinCode, address, cityDistrictTown, state, landmark, alternatePhone, addressType } }
 * @returns {Object} JSON response containing updated address document
 */
exports.addAddress = async (req, res) => {
  try {
    const { payload } = req.body;

    if (!payload?.address) {
      return res.status(400).json({ error: "Params address required" });
    }

    if (payload.address._id) {
      // Update existing address entry matching address ID
      const updatedAddress = await UserAddress.findOneAndUpdate(
        { user: req.user._id, "address._id": payload.address._id },
        { $set: { "address.$": payload.address } },
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(404).json({ error: "Address not found" });
      }

      return res.status(201).json({ address: updatedAddress });
    } else {
      // Push new shipping address to the user's address array
      const newAddress = await UserAddress.findOneAndUpdate(
        { user: req.user._id },
        { $push: { address: payload.address } },
        { new: true, upsert: true }
      );

      return res.status(201).json({ address: newAddress });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches the user's saved shipping address list.
 * @route POST /api/user/getaddress
 * @param {Object} req.user - Authenticated user object
 * @returns {Object} JSON response containing user's address book
 */
exports.getAddress = async (req, res) => {
  try {
    const userAddress = await UserAddress.findOne({ user: req.user._id });
    if (!userAddress) {
      return res.status(404).json({ error: "Address not found" });
    }
    return res.status(200).json({ userAddress });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

