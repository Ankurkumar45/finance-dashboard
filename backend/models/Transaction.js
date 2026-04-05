const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be income or expense",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "salary",
        "freelance",
        "investment",
        "rental",
        "other-income",
        "food",
        "transport",
        "utilities",
        "healthcare",
        "entertainment",
        "shopping",
        "education",
        "rent",
        "other-expense",
      ],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1, category: 1 });
transactionSchema.index({ createdBy: 1 });

// Soft delete filter
transactionSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

module.exports = mongoose.model("Transaction", transactionSchema);