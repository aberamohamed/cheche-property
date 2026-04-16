import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Converts width percentage to DP.
 * @param widthPercent The percentage of screen's width.
 * @returns number
 */
export const wp = (widthPercent: number | string): number => {
    const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

/**
 * Converts height percentage to DP.
 * @param heightPercent The percentage of screen's height.
 * @returns number
 */
export const hp = (heightPercent: number | string): number => {
    const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

/**
 * Resizes font based on screen width.
 * @param size The font size.
 * @returns number
 */
export const rf = (size: number): number => {
    const scale = SCREEN_WIDTH / guidelineBaseWidth;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Moderated responsive font — scales with screen width but dampens
 * agressive growth on large screens (iPad). factor 0 = no scaling, 1 = full scaling.
 * @param size The font size based on the 375pt baseline.
 * @param factor Damping factor (default 0.4)
 * @returns number
 */
export const mrf = (size: number, factor = 0.4): number => {
    const scale = SCREEN_WIDTH / guidelineBaseWidth;
    const newSize = size + (size * scale - size) * factor;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Scaled size based on screen width.
 * @param size The size to scale.
 * @returns number
 */
export const s = (size: number): number => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scaled size based on screen height.
 * @param size The size to scale.
 * @returns number
 */
export const vs = (size: number): number => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

export const mvs = (size: number, factor = 0.5): number => size + (vs(size) - size) * factor;

export default {
    wp,
    hp,
    rf,
    mrf,
    s,
    vs,
    mvs,
};
