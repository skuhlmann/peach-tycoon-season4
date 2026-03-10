import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Contacts";

function airtableUrl(path: string) {
  return `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}${path}`;
}

function airtableHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * GET /api/contacts?wallet=0x...
 * Returns { hasEmail: boolean }
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
  }

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    // Airtable not configured yet — don't show prompt
    return NextResponse.json({ hasEmail: true });
  }

  try {
    const filterFormula = encodeURIComponent(`{Wallet}="${wallet}"`);
    const res = await fetch(
      `${airtableUrl("")}?filterByFormula=${filterFormula}&maxRecords=1`,
      { headers: airtableHeaders() }
    );

    if (!res.ok) {
      return NextResponse.json({ hasEmail: true }); // fail safe
    }

    const data = await res.json();
    const record = data.records?.[0];
    const hasEmail = !!record?.fields?.Email;

    return NextResponse.json({ hasEmail });
  } catch {
    return NextResponse.json({ hasEmail: true }); // fail safe
  }
}

/**
 * POST /api/contacts
 * Body: { wallet: string, email: string }
 */
export async function POST(req: NextRequest) {
  const { wallet, email } = await req.json();

  if (!wallet || !email) {
    return NextResponse.json({ error: "Missing wallet or email" }, { status: 400 });
  }

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    // Stub: log and return success so UX works during development
    console.log("[contacts stub] Would save:", { wallet, email });
    return NextResponse.json({ success: true });
  }

  try {
    // Check if record exists
    const filterFormula = encodeURIComponent(`{Wallet}="${wallet}"`);
    const checkRes = await fetch(
      `${airtableUrl("")}?filterByFormula=${filterFormula}&maxRecords=1`,
      { headers: airtableHeaders() }
    );
    const checkData = await checkRes.json();
    const existing = checkData.records?.[0];

    if (existing) {
      // Update existing record
      await fetch(`${airtableUrl(`/${existing.id}`)}`, {
        method: "PATCH",
        headers: airtableHeaders(),
        body: JSON.stringify({ fields: { Email: email, Wallet: wallet } }),
      });
    } else {
      // Create new record
      await fetch(airtableUrl(""), {
        method: "POST",
        headers: airtableHeaders(),
        body: JSON.stringify({ fields: { Email: email, Wallet: wallet } }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Airtable error:", err);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}
