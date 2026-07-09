import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, linkedin, domain, problem, productDescription, stage, bottleneck, whyPomegroup } = data;

    // Simple server-side validation
    if (!name || !email || !linkedin || !domain || !problem || !productDescription || !stage || !bottleneck || !whyPomegroup) {
      return NextResponse.json(
        { success: false, error: 'Missing required application fields.' },
        { status: 400 }
      );
    }

    // In a production app, we would write to Supabase or send a webhook (e.g. Slack/Discord)
    // For now, we log the captured inbound lead to console for server-side verification
    console.log('====================================');
    console.log('NEW INBOUND CO-FOUNDER APPLICATION:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`LinkedIn: ${linkedin}`);
    console.log(`Domain: ${domain}`);
    console.log(`Problem: ${problem}`);
    console.log(`Product: ${productDescription}`);
    console.log(`Stage: ${stage}`);
    console.log(`Bottleneck: ${bottleneck}`);
    console.log(`Why Pomegroup: ${whyPomegroup}`);
    console.log('====================================');

    return NextResponse.json(
      { success: true, message: 'Application received and logged successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error processing application:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing application.' },
      { status: 500 }
    );
  }
}
