import { Product } from '@/lib/models/Product';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const newProduct = new Product({
      productName: body.productName,
      weights: body.weights,
    });

    await newProduct.save();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function GET() {
    try {
      await connectDB();
      const products = await Product.find().lean();
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Failed to load products' }, { status: 500 });
    }
  }
