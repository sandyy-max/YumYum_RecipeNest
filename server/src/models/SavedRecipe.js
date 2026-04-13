import mongoose from 'mongoose';

const savedRecipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    kind: {
      type: String,
      enum: ['favorite', 'cook_later'],
      required: true,
    },
  },
  { timestamps: true }
);

savedRecipeSchema.index({ user: 1, recipe: 1, kind: 1 }, { unique: true });

export default mongoose.model('SavedRecipe', savedRecipeSchema);
