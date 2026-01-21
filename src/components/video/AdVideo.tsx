import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img, useVideoConfig } from 'remotion';
import React from 'react';
import { Product } from '../../types/product';

interface AdVideoProps {
  script: string;
  product: Product;
  isAdvanced?: boolean;
}

const TextSection: React.FC<{
  text: string;
  image: string;
  isAdvanced?: boolean;
  style?: React.CSSProperties;
}> = ({ text, image, isAdvanced, style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  // Standard animation
  const standardScale = interpolate(
    frame,
    [0, 15, 75, 90],
    [0.95, 1, 1, 0.95],
    { extrapolateRight: 'clamp' }
  );

  // Advanced animation: Slow zoom in + slight rotation or pan effect
  const advancedScale = interpolate(
    frame,
    [0, 90],
    [1, 1.15], // Continuous slow zoom
    { extrapolateRight: 'clamp' }
  );

  const advancedOpacity = interpolate(
    frame,
    [0, 10, 80, 90],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  );

  const imageScale = isAdvanced ? advancedScale : standardScale;
  const opacity = isAdvanced ? advancedOpacity : interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        ...style,
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        backgroundColor: isAdvanced ? '#0a0a0a' : 'white', // Dark mode for advanced
        padding: '40px',
      }}
    >
      <div
        style={{
          flex: isVertical ? '3' : '1',
          width: '100%',
          height: isVertical ? '60%' : '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${imageScale})`,
          transition: !isAdvanced ? 'transform 0.3s ease-in-out' : undefined,
        }}
      >
        <Img
          src={image}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            maxWidth: '1200px',
            maxHeight: '1200px',
            filter: isAdvanced ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' : 'none',
          }}
        />
      </div>

      <div
        style={{
          flex: isVertical ? '2' : '1',
          width: '100%',
          padding: isVertical ? '20px' : '40px',
          opacity: opacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: isVertical ? 60 : 48,
            fontWeight: 'bold',
            color: isAdvanced ? '#ffffff' : '#1a1a1a', // White text for advanced
            lineHeight: 1.2,
            textShadow: isAdvanced ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          {text}
        </h1>
      </div>
    </AbsoluteFill>
  );
};

export const AdVideo: React.FC<AdVideoProps> = ({ script, product, isAdvanced }) => {
  const allImages = [product.image, ...product.images].filter(img =>
    !img.includes('360') && !img.toLowerCase().includes('spin')
  );

  const sections = script
    .split('\n\n')
    .filter(Boolean)
    .map((section) => {
      const visual = section.split('\nVO:')[0].replace('VISUAL:', '').trim();
      return visual;
    });

  return (
    <AbsoluteFill style={{ backgroundColor: isAdvanced ? '#0a0a0a' : 'white' }}>
      {sections.map((text, index) => (
        <Sequence
          key={index}
          from={index * 90}
          durationInFrames={90}
        >
          <TextSection
            text={text}
            image={allImages[index % allImages.length]}
            isAdvanced={isAdvanced}
            style={{ opacity: 1 }}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Export just the component, let the API handle composition configuration
export default AdVideo; 