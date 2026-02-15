import React from 'react';
import { AbsoluteFill } from 'remotion';

/**
 * Debug overlay for Instagram Reels safe zones.
 *
 * NOTE: UI overlays vary by device/app version. This guide is intentionally conservative.
 * Defaults:
 * - Left/Right padding: 80px
 * - Top blocked area: 250px
 * - Bottom blocked area: 400px
 */
export const SafeZoneGuide: React.FC<{
  enabled?: boolean;
  leftRight?: number;
  top?: number;
  bottom?: number;
}> = ({
  enabled = true,
  leftRight = 80,
  top = 250,
  bottom = 400,
}) => {
  if (!enabled) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Dim blocked areas */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(255,0,0,0.06)',
          top: 0,
          height: top,
          position: 'absolute',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(255,0,0,0.06)',
          bottom: 0,
          height: bottom,
          position: 'absolute',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(255,0,0,0.06)',
          left: 0,
          width: leftRight,
          position: 'absolute',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(255,0,0,0.06)',
          right: 0,
          width: leftRight,
          position: 'absolute',
        }}
      />

      {/* Safe area outline */}
      <AbsoluteFill
        style={{
          position: 'absolute',
          left: leftRight,
          right: leftRight,
          top,
          bottom,
          border: '3px solid rgba(0, 255, 140, 0.8)',
          boxSizing: 'border-box',
        }}
      />

      {/* Labels */}
      <AbsoluteFill
        style={{
          position: 'absolute',
          left: leftRight + 12,
          top: top + 12,
          fontSize: 28,
          fontFamily: 'sans-serif',
          color: 'rgba(0,255,140,0.95)',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        }}
      >
        SAFE ZONE
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          position: 'absolute',
          left: 12,
          top: 12,
          fontSize: 24,
          fontFamily: 'sans-serif',
          color: 'rgba(255,0,0,0.85)',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        }}
      >
        BLOCKED (UI)
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
