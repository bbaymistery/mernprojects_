require('dotenv').config();
const PORT = process.env.PORT || 2000;

const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./connectDB');
const path = require('path');

//routes
const userRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/adminAuth');
const categoryRoutes = require('./routes/category');
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");;
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");

// Connect to MongoDB
connectDB();

//middlewares 
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use('/api/auth', userRoutes);
app.use('/api/auth', adminRoutes);
app.use('/api', categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);

app.listen(PORT, () => {
    //server running on httplocalhost:2000
    console.log(`🟢Server is running on http://localhost:${PORT}🟢`);
});