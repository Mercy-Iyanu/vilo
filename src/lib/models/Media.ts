import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["photo", "video"], required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Media || mongoose.model("Media", mediaSchema);