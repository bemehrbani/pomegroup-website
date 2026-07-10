import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      name, 
      email, 
      linkedin, 
      domain, 
      problem, 
      productDescription, 
      stage, 
      bottleneck, 
      whyPomegroup,
      // Lead Calculator fields
      role, 
      traction, 
      idea 
    } = data;

    // Detect if this is an Equity Calculator lead or a Full Co-Build application
    const isCalculatorLead = role === 'Equity Calculator Lead';

    if (isCalculatorLead) {
      if (!email || !name || !idea) {
        return NextResponse.json(
          { success: false, error: 'Missing required lead fields (email, name, idea).' },
          { status: 400 }
        );
      }
    } else {
      // Co-Build validation
      if (!name || !email || !linkedin || !domain || !problem || !productDescription || !stage || !bottleneck || !whyPomegroup) {
        return NextResponse.json(
          { success: false, error: 'Missing required application fields.' },
          { status: 400 }
        );
      }
    }

    // Prepare telegram notification text
    let telegramText = '';
    if (isCalculatorLead) {
      telegramText = `📊 *New Equity Calculator Lead!*\n\n` +
        `👤 *Name:* ${name}\n` +
        `✉️ *Email:* ${email}\n` +
        `💡 *Concept/Idea:* ${idea}\n` +
        `💼 *Role:* ${role}\n` +
        `📈 *Traction:* ${traction}`;
    } else {
      telegramText = `🚀 *New Inbound Co-Build Application!*\n\n` +
        `👤 *Name:* ${name}\n` +
        `✉️ *Email:* ${email}\n` +
        `🔗 *LinkedIn:* ${linkedin}\n` +
        `🏢 *Domain:* ${domain}\n` +
        `❓ *Problem:* ${problem}\n` +
        `🛠️ *Product:* ${productDescription}\n` +
        `📊 *Stage:* ${stage}\n` +
        `⚠️ *Bottleneck:* ${bottleneck}\n` +
        `💭 *Why Pomegroup:* ${whyPomegroup}`;
    }

    // Log to console for server-side verification
    console.log('====================================');
    console.log(telegramText);
    console.log('====================================');

    // Send Telegram Notification if env variables are configured
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: telegramText,
            parse_mode: 'Markdown',
          }),
        });
        if (!tgRes.ok) {
          const errMsg = await tgRes.text();
          console.error('Telegram Bot API returned error:', errMsg);
        } else {
          console.log('Telegram notification sent successfully.');
        }
      } catch (tgErr) {
        console.error('Failed to send Telegram notification:', tgErr);
      }
    }

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
