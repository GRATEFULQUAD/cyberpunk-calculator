import { NextRequest, NextResponse } from "next/server";

// Proxies a free, no-API-key exchange rate service (Frankfurter, backed by
// European Central Bank reference rates) so the browser never needs a key
// and we avoid any client-side CORS issues. Cached briefly at the edge/CDN.

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get("base") || "USD";

  try {
    const upstream = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`, {
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream rate provider unavailable" },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    return NextResponse.json({
      base: data.base,
      date: data.date,
      rates: { ...data.rates, [data.base]: 1 },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach exchange rate provider" },
      { status: 503 }
    );
  }
}
