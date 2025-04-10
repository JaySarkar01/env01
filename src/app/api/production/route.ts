import { Production } from '@/lib/models/Production';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { productId, weight, quantity, date } = body;

    if (!productId || !weight || !weight.value || !weight.unit || !quantity) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if a record already exists with same productId and weight
    const existingRecord = await Production.findOne({
      productId,
      'weight.value': weight.value,
      'weight.unit': weight.unit,
    });

    if (existingRecord) {
      // Update the quantity
      existingRecord.quantity += quantity;
      await existingRecord.save();

      return NextResponse.json(
        { message: 'Production record updated', record: existingRecord },
        { status: 200 }
      );
    } else {
      // Create a new record
      const newProduction = await Production.create({
        productId,
        weight,
        quantity,
        date: date || new Date(),
      });

      return NextResponse.json(
        { message: 'New production record created', record: newProduction },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('POST /api/production error:', error);
    return NextResponse.json({ message: 'Failed to create/update production record' }, { status: 500 });
  }
}
