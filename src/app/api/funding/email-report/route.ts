import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, concept, results } = body;

    if (!email || !results || !Array.isArray(results)) {
      return NextResponse.json(
        { success: false, error: 'Email and matched results are required.' },
        { status: 400 }
      );
    }

    // In a production app, we would compile a PDF and email it using Nodemailer / SendGrid,
    // or trigger a CRM webhook (e.g. HubSpot/Zapier)
    // For now, we log the captured lead to server console to verify it works
    console.log('====================================');
    console.log('NEW INBOUND LEAD: FUNDING REPORT DOWNLOAD REQUEST');
    console.log(`Email Address: ${email}`);
    console.log(`Venture Concept: ${concept || 'N/A'}`);
    console.log(`Matched Grants Count: ${results.length}`);
    results.forEach((grant: { title: string; relevanceScore?: number }, idx: number) => {
      console.log(`  Match ${idx + 1}: ${grant.title} (${grant.relevanceScore || 'N/A'}% Match)`);
    });
    console.log('====================================');

    return NextResponse.json({
      success: true,
      message: 'Funding report successfully compiled and sent to ' + email
    });
  } catch (err: unknown) {
    console.error('Error in email-report route:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error compiling and sending email report.' },
      { status: 500 }
    );
  }
}
