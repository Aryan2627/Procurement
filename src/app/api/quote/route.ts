import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET quotations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rfqId = searchParams.get('rfqId');
    const quotations = await db.getQuotations();
    
    if (rfqId) {
      const filtered = quotations.filter(q => q.rfqId === rfqId);
      return NextResponse.json({ success: true, data: filtered });
    }
    
    return NextResponse.json({ success: true, data: quotations });
  } catch (error: any) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json({ error: 'Failed to fetch quotations', details: error.message }, { status: 500 });
  }
}

// POST submit quotation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rfqId, vendorId, price, tax, deliveryDate, documents } = body;

    if (!rfqId || !vendorId || !price || !deliveryDate) {
      return NextResponse.json({ error: 'Missing required quotation fields' }, { status: 400 });
    }

    const quotation = await db.createQuotation({
      rfqId,
      vendorId,
      price: parseFloat(price),
      tax: parseFloat(tax || '0'),
      deliveryDate: new Date(deliveryDate).toISOString(),
      documents: documents || null,
      status: 'SUBMITTED',
    });

    // Notify Buyer
    const rfqs = await db.getRFQs();
    const rfqObj = rfqs.find(r => r.id === rfqId);
    const vendors = await db.getVendors();
    const vendorObj = vendors.find(v => v.id === vendorId);

    if (rfqObj && vendorObj) {
      await db.createNotification(
        rfqObj.buyerId,
        `Vendor "${vendorObj.name}" submitted a quotation for RFQ "${rfqObj.title}".`
      );
      await db.createAuditLog(rfqObj.buyerId, 'SUBMIT_QUOTE', `Vendor ${vendorObj.name} submitted quotation for ${rfqObj.title}`);
    }

    return NextResponse.json({ success: true, data: quotation });
  } catch (error: any) {
    console.error('Error submitting quotation:', error);
    return NextResponse.json({ error: 'Failed to submit quotation', details: error.message }, { status: 500 });
  }
}

// PUT accept/reject quotation (award contract)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, buyerId } = body; // status can be "WON"

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });
    }

    if (status === 'WON') {
      // 1. Mark quote as WON
      const quote = await db.updateQuotationStatus(id, 'WON');
      const allQuotes = await db.getQuotations();
      
      // 2. Mark other quotations for the same RFQ as LOST
      const siblings = allQuotes.filter(q => q.rfqId === quote.rfqId && q.id !== quote.id);
      for (const sib of siblings) {
        await db.updateQuotationStatus(sib.id, 'LOST');
      }

      // 3. Update RFQ status to CLOSED
      await db.updateRFQStatus(quote.rfqId, 'CLOSED');

      // 4. Auto-Generate Purchase Order (PO)
      const vendors = await db.getVendors();
      const vendorObj = vendors.find(v => v.id === quote.vendorId);
      
      const newPO = await db.createPurchaseOrder({
        quotationId: quote.id,
        vendorId: quote.vendorId,
        buyerId: buyerId || 'u-buyer',
        totalPrice: quote.price + quote.tax,
        tax: quote.tax,
        deliveryDate: typeof quote.deliveryDate === 'string' ? quote.deliveryDate : (quote.deliveryDate as Date).toISOString(),
        status: 'PENDING',
      });

      // 5. Create Approval Chain for PO
      await db.createApproval({
        type: 'PO',
        targetId: newPO.id,
        currentLevel: 'MANAGER',
      });

      // 6. Notify Vendor
      const users = await db.getUsers();
      if (vendorObj) {
        const vendorUser = users.find(u => u.email === vendorObj.email);
        if (vendorUser) {
          await db.createNotification(
            vendorUser.id,
            `Congratulations! Your quotation for RFQ has been accepted. Purchase Order ${newPO.poNumber} has been generated.`
          );
        }
      }

      // 7. Log Audit
      await db.createAuditLog(buyerId || 'u-buyer', 'AWARD_RFQ_CONTRACT', `Awarded contract to quote ${quote.id}. Generated PO ${newPO.poNumber}`);

      return NextResponse.json({ success: true, message: 'Contract awarded, PO generated', data: { quote, po: newPO } });
    } else {
      const quote = await db.updateQuotationStatus(id, status);
      return NextResponse.json({ success: true, data: quote });
    }
  } catch (error: any) {
    console.error('Error awarding quotation:', error);
    return NextResponse.json({ error: 'Failed to update quotation status', details: error.message }, { status: 500 });
  }
}
