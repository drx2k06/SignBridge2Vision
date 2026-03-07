import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const room = 'hackathon-room';
    const identity = 'user-' + Math.floor(Math.random() * 1000);

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      { identity }
    );

    at.addGrant({ roomJoin: true, room });

    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Token generation failed' },
      { status: 500 }
    );
  }
}