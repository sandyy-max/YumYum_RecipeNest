import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    cookingTimeMinutes: { type: Number, default: 0, min: 0 },
    ingredients: [{ type: String, trim: true }],
    instructions: [{ type: String, trim: true }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

recipeSchema.index({ status: 1, createdAt: -1 });
recipeSchema.index({ title: 1 });
recipeSchema.index({ chef: 1 });

export default mongoose.model('Recipe', recipeSchema);
