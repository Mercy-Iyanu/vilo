import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model("Event", eventSchema);