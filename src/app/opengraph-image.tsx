
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'AI Video Generator - Transform Product URLs into Video Ads';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a',
                    backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                            marginRight: 20,
                        }}
                    />
                    <div
                        style={{
                            backgroundImage: 'linear-gradient(to right, #f8fafc, #94a3b8)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontSize: 60,
                            fontWeight: 800,
                            letterSpacing: '-0.025em',
                        }}
                    >
                        AI Video Generator
                    </div>
                </div>
                <div
                    style={{
                        color: '#94a3b8',
                        fontSize: 30,
                        textAlign: 'center',
                        maxWidth: 800,
                        lineHeight: 1.4,
                    }}
                >
                    Transform Amazon & Shopify Product URLs
                    <br />
                    into Professional Video Ads Instantly
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: 50,
                        alignItems: 'center',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#1e293b', borderRadius: 12, border: '1px solid #334155', color: '#cbd5e1', fontSize: 20 }}>
                        Powered by GPT-4 & Remotion
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
