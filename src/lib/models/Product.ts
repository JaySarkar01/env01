import mongoose, { Schema, Document, models, model } from 'mongoose';

interface IWeight {
  value: number;
  unit: string;
}

export interface IProduct extends Document {
  productName: string;
  weights: IWeight[];
}

const WeightSchema = new Schema<IWeight>({
  value: { type: Number, required: true },
  unit: { type: String, required: true },
});

const ProductSchema = new Schema<IProduct>({
  productName: { type: String, required: true },
  weights: { type: [WeightSchema], required: true },
}, {
  timestamps: true,
});

export const Product = models.Product || model<IProduct>('Product', ProductSchema);
