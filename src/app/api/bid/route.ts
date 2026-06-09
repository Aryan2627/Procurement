import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET auctions
export async function GET() {
  try {
    const auctions = await db.getAuctions();
    return NextResponse.json({ success: true, data: auctions });
  } catch (error: any) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json({ error: 'Failed to fetch auctions', details: error.message }, { status: 500 });
  }
}

// POST place a bid
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auctionId, bidderName, amount } = body;

    if (!auctionId || !bidderName || amount === undefined) {
      return NextResponse.json({ error: 'Missing bid fields' }, { status: 400 });
    }

    const bidVal = parseFloat(amount);
    const auctions = await db.getAuctions();
    const auction = auctions.find(a => a.id === auctionId);

    if (!auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }

    if (auction.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Auction has already ended' }, { status: 400 });
    }

    // Validate bid decrement rule
    const currentLow = auction.currentBid;
    const decrement = auction.minDecrement;

    if (bidVal >= currentLow) {
      return NextResponse.json({ error: `Bid must be lower than the current bid of $${currentLow}` }, { status: 400 });
    }

    if (currentLow - bidVal < decrement) {
      return NextResponse.json({ error: `Bid must be at least $${decrement} lower than the current bid` }, { status: 400 });
    }

    // Place bid
    const updatedAuction = await db.placeBid(auctionId, bidderName, bidVal);
    
    // Notify buyer
    const rfqs = await db.getRFQs();
    const rfqObj = rfqs.find(r => r.id === auction.rfqId);
    if (rfqObj) {
      await db.createNotification(
        rfqObj.buyerId,
        `New low bid of $${bidVal} placed on auction "${auction.title}" by ${bidderName}.`
      );
    }

    return NextResponse.json({ success: true, data: updatedAuction });
  } catch (error: any) {
    console.error('Error placing bid:', error);
    return NextResponse.json({ error: 'Failed to place bid', details: error.message }, { status: 500 });
  }
}
