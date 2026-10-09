const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // https://www.youtube.com/watch?v=PaPQrbYttsY&list=PLB_Wd4-5SGAYsxD4JGaVdXll3PnoyI-AM&index=21
    //desr20 de anlatdigina gore SAmsunga tikliyanda full samsung phones gelir
    //apple tikliyanda image slider gelir 
    //birde basga bir phones ve ya tv tikliyanda basga bir design gelir 
    //ona gore type eklenir 
    //
    //Type store > full phones 
    //type page slider image ile(appledeki kimi)
    //type product olanda ise > basga sekilde product acilir Yani 3dene type var
    type: {
      type: String,
    },
    categoryImage: { 
      type: String 
    },
    parentId: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
