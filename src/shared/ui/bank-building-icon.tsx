import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

const VIEW_BOX = '0 0 48 48';
const STROKE_WIDTH = 4;

type BankBuildingIconProps = SvgProps & {
  size?: number;
};

export function BankBuildingIcon({ size = 48, color = 'currentColor', ...rest }: BankBuildingIconProps) {
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill="none" {...rest}>
      <Path
        d="M6 44H42"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 36V22"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 36V22"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M28 36V22"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M36 36V22"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24 4L40 14H8L24 4Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
