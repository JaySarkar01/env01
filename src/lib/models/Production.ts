import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProduction extends Document {
  productId: mongoose.Types.ObjectId;
  weight: {
    value: number;
    unit: string;
  };
  quantity: number;
  date: Date;
}

const ProductionSchema = new Schema<IProduction>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    weight: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Production = models.Production || model<IProduction>('Production', ProductionSchema);
