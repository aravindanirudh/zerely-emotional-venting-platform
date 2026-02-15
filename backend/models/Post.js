const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emoji: {
      type: String,
      required: true,
      enum: ["❤️", "🤗", "😢", "😡", "💪", "🙏"],
    },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 5000,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  mood: {
    type: String,
    required: true,
    enum: [
      "happy",
      "sad",
      "angry",
      "anxious",
      "confused",
      "neutral",
      "hopeful",
      "grateful",
    ],
  },
  reactions: [reactionSchema],
  reactionCounts: {
    "❤️": { type: Number, default: 0 },
    "🤗": { type: Number, default: 0 },
    "😢": { type: Number, default: 0 },
    "😡": { type: Number, default: 0 },
    "💪": { type: Number, default: 0 },
    "🙏": { type: Number, default: 0 },
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  autoDelete: {
    enabled: {
      type: Boolean,
      default: false,
    },
    deleteAt: {
      type: Date,
      default: null,
    },
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  deletedByAdmin: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
    select: false, // Hiding IP address from the response. This means when the backend runs Post.find() to send posts to the frontend, Mongoose automatically excludes this field so it doesn't get sent to the user's browser
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index({ "autoDelete.deleteAt": 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
