import Svg, { Path } from "react-native-svg";

const ChevronRight = ({ size = 24, color = "#999" }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M9 18l6-6-6-6" />
    </Svg>
);

export default ChevronRight;
