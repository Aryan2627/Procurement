import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all RFQs
export async function GET() {
  try {
    const rfqs = await db.getRFQs();
    return NextResponse.json({ success: true, data: rfqs });
  } catch (error: any) {
    console.error('Error fetching RFQs:', error);
    return NextResponse.json({ error: 'Failed to fetch RFQs', details: error.message }, { status: 500 });
  }
}

// POST create RFQ
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, quantity, budget, deadline, selectedVendors, buyerId } = body;

    if (!title || !description || !category || !quantity || !budget || !deadline || !buyerId) {
      return NextResponse.json({ error: 'Missing required RFQ fields' }, { status: 400 });
    }

    const rfq = await db.createRFQ({
      title,
      description,
      category,
      quantity: parseInt(quantity, 10),
      budget: parseFloat(budget),
      deadline: new Date(deadline).toISOString(),
      documents: body.documents || null,
      status: 'PUBLISHED', // Start as published for immediate vendor visibility
      buyerId,
      selectedVendors: Array.isArray(selectedVendors) ? selectedVendors.join(',') : selectedVendors || null,
    });

    // Write audit log
    await db.createAuditLog(buyerId, 'CREATE_RFQ', `Created RFQ: ${title}`);

    // Create notifications for selected vendors
    const vendorIds = Array.isArray(selectedVendors) ? selectedVendors : (selectedVendors || '').split(',').filter(Boolean);
    const users = await db.getUsers();
    
    for (const vId of vendorIds) {
      // Find user associated with the vendor, or notify in general
      const vendors = await db.getVendors();
      const vendorObj = vendors.find(v => v.id === vId);
      if (vendorObj) {
        const vendorUser = users.find(u => u.email === vendorObj.email);
        if (vendorUser) {
          await db.createNotification(vendorUser.id, `New RFQ available: "${title}" matching your profile.`);
        }
      }
    }

    return NextResponse.json({ success: true, data: rfq });
  } catch (error: any) {
    console.error('Error creating RFQ:', error);
    return NextResponse.json({ error: 'Failed to create RFQ', details: error.message }, { status: 500 });
  }
}

// PUT update RFQ status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, buyerId } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });
    }

    const updated = await db.updateRFQStatus(id, status);
    
    if (buyerId) {
      await db.createAuditLog(buyerId, 'UPDATE_RFQ_STATUS', `Updated RFQ (${id}) status to ${status}`);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating RFQ status:', error);
    return NextResponse.json({ error: 'Failed to update RFQ status', details: error.message }, { status: 500 });
  }
}

// DELETE RFQ
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const buyerId = searchParams.get('buyerId') || 'u-buyer';

    if (!id) {
      return NextResponse.json({ error: 'Missing RFQ ID parameter' }, { status: 400 });
    }

    await db.deleteRFQ(id);
    await db.createAuditLog(buyerId, 'DELETE_RFQ', `Deleted RFQ: ${id}`);

    return NextResponse.json({ success: true, message: 'RFQ deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting RFQ:', error);
    return NextResponse.json({ error: 'Failed to delete RFQ', details: error.message }, { status: 500 });
  }
}
