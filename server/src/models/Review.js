import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5 },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
