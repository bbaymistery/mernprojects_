const Order = require("../../models/order");

/**
 * Updates the fulfillment tracking status step (ordered, packed, shipped, delivered) of a customer order.
 * @route POST /api/admin/order/update
 * @param {Object} req.body - { orderId, type } where type is 'packed', 'shipped', or 'delivered'
 * @returns {Object} JSON response confirming update status
 */
exports.updateOrder = async (req, res) => {
  try {
    const { orderId, type } = req.body;

    const updatedOrder = await Order.updateOne(
      { _id: orderId, "orderStatus.type": type },
      {
        $set: {
          "orderStatus.$": {
            type,
            date: new Date(),
            isCompleted: true,
          },
        },
      }
    );

    if (updatedOrder.modifiedCount === 0) {
      return res.status(404).json({ message: "Order not found or already updated." });
    }

    res.status(200).json({ order: updatedOrder });
  } catch (error) {
    console.error("Order Update Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Retrieves all customer orders for administrative processing in the admin dashboard.
 * @route POST /api/admin/order/getCustomerOrders
 * @returns {Object} JSON response containing list of all customer orders with populated product titles
 */
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.productId", "name")
      .exec();

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

