import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, phone, employees, industry } = body;

    // Basic Validation
    if (!name || !email || !company || !phone || !employees || !industry) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const numEmployees = parseInt(employees, 10);
    if (isNaN(numEmployees)) {
      return NextResponse.json(
        { error: 'Employees must be a valid number' },
        { status: 400 }
      );
    }

    // Submit to db service
    const result = await db.submitBookDemo({
      name,
      email,
      company,
      phone,
      employees: numEmployees,
      industry,
    });

    return NextResponse.json({
      success: true,
      message: 'Demo request received successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error booking demo:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
