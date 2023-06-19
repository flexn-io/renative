package com.como.RNTShadowView;

import android.graphics.Color;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.como.RNTShadowView.ShadowView;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.yoga.YogaConstants;

public class RNTShadowViewManager extends ViewGroupManager<ShadowView> {
    public static final String REACT_CLASS = "RNTShadowView";
    private static final int[] SPACING_TYPES = {
            Spacing.ALL,
            Spacing.LEFT,
            Spacing.RIGHT,
            Spacing.TOP,
            Spacing.BOTTOM,
            Spacing.START,
            Spacing.END,
    };

    @ReactPropGroup(
            names = {
                    ViewProps.BORDER_RADIUS,
                    ViewProps.BORDER_TOP_LEFT_RADIUS,
                    ViewProps.BORDER_TOP_RIGHT_RADIUS,
                    ViewProps.BORDER_BOTTOM_RIGHT_RADIUS,
                    ViewProps.BORDER_BOTTOM_LEFT_RADIUS,
                    ViewProps.BORDER_TOP_START_RADIUS,
                    ViewProps.BORDER_TOP_END_RADIUS,
                    ViewProps.BORDER_BOTTOM_START_RADIUS,
                    ViewProps.BORDER_BOTTOM_END_RADIUS,
            },
            defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderRadius(ReactViewGroup view, int index, float borderRadius) {
        if (!YogaConstants.isUndefined(borderRadius) && borderRadius < 0) {
            borderRadius = YogaConstants.UNDEFINED;
        }

        if (!YogaConstants.isUndefined(borderRadius)) {
            borderRadius = PixelUtil.toPixelFromDIP(borderRadius);
        }

        if (index == 0) {
            view.setBorderRadius(borderRadius);
        } else {
            view.setBorderRadius(borderRadius, index - 1);
        }
    }

    @ReactProp(name = "borderStyle")
    public void setBorderStyle(ReactViewGroup view, @Nullable String borderStyle) {
        view.setBorderStyle(borderStyle);
    }

    @ReactPropGroup(
            names = {
                    ViewProps.BORDER_WIDTH,
                    ViewProps.BORDER_LEFT_WIDTH,
                    ViewProps.BORDER_RIGHT_WIDTH,
                    ViewProps.BORDER_TOP_WIDTH,
                    ViewProps.BORDER_BOTTOM_WIDTH,
                    ViewProps.BORDER_START_WIDTH,
                    ViewProps.BORDER_END_WIDTH,
            },
            defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderWidth(ReactViewGroup view, int index, float width) {
        if (!YogaConstants.isUndefined(width) && width < 0) {
            width = YogaConstants.UNDEFINED;
        }

        if (!YogaConstants.isUndefined(width)) {
            width = PixelUtil.toPixelFromDIP(width);
        }

        view.setBorderWidth(SPACING_TYPES[index], width);
    }

    @ReactPropGroup(
            names = {
                    ViewProps.BORDER_COLOR,
                    ViewProps.BORDER_LEFT_COLOR,
                    ViewProps.BORDER_RIGHT_COLOR,
                    ViewProps.BORDER_TOP_COLOR,
                    ViewProps.BORDER_BOTTOM_COLOR,
                    ViewProps.BORDER_START_COLOR,
                    ViewProps.BORDER_END_COLOR
            },
            customType = "Color")
    public void setBorderColor(ReactViewGroup view, int index, Integer color) {
        float rgbComponent =
                color == null ? YogaConstants.UNDEFINED : (float) ((int) color & 0x00FFFFFF);
        float alphaComponent = color == null ? YogaConstants.UNDEFINED : (float) ((int) color >>> 24);
        view.setBorderColor(SPACING_TYPES[index], rgbComponent, alphaComponent);
    }

    @ReactProp(name = "shadowBorderRadius", defaultDouble = 0)
    public void shadowBorderRadius(final ShadowView shadowView, @Nullable double borderRadius) {
        if (shadowView != null) {
            shadowView.setShadowBorderRadius(borderRadius);
        }
    }
//
//    @ReactProp(name = "borderColor")
//    public void setBorderColor(final ShadowView shadowView, @Nullable String borderColor) {
//        if (shadowView != null) {
//            shadowView.setBorderColor(parseColor(borderColor));
//        }
//    }
//
//    @ReactProp(name = "borderWidth")
//    public void setBorderWidth(final ShadowView shadowView, @Nullable double borderWidth) {
//        if (shadowView != null) {
//            shadowView.setBorderWidth(borderWidth);
//        }
//    }



    @ReactProp(name = "backgroundColor")
    public void setBackgroundColor(final ShadowView shadowView, @Nullable String backgroundColor) {
        if (shadowView != null) {
            shadowView.setBackgroundColor(parseColor(backgroundColor));
        }
    }

    @ReactProp(name = "shadowColor")
    public void setShadowColor(final ShadowView shadowView, @Nullable String shadowColor) {
        if (shadowView != null) {
            shadowView.setShadowColor(parseColor(shadowColor));
        }
    }

    @ReactProp(name = "shadowOffsetX", defaultDouble = 0)
    public void setShadowOffsetX(final ShadowView shadowView, @Nullable double shadowOffsetX) {
        if (shadowView != null) {
            shadowView.setShadowOffsetX(shadowOffsetX);
        }
    }

    @ReactProp(name = "shadowOffsetY", defaultDouble = 0)
    public void setShadowOffsetY(final ShadowView shadowView, @Nullable double shadowOffsetY) {
        if (shadowView != null) {
            shadowView.setShadowOffsetY(shadowOffsetY);
        }
    }

    @ReactProp(name = "shadowOpacity", defaultDouble = 1)
    public void setShadowOpacity(final ShadowView shadowView, @Nullable double shadowOpacity) {
        if (shadowView != null) {
            shadowView.setShadowOpacity(shadowOpacity);
        }
    }

    @ReactProp(name = "shadowRadius")
    public void setShadowRadius(final ShadowView shadowView, double shadowRadius) {
        if (shadowView != null) {
            shadowView.setShadowRadius(shadowRadius);
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ShadowView createViewInstance(ThemedReactContext context) {
        return new ShadowView(context);
    }

    private int parseColor(String colorString) {
        if (colorString == null) {
            return Color.TRANSPARENT;
        }
        Pattern pattern = Pattern.compile("\\((\\d+),(\\d+),(\\d+)(,([\\d|\\.]+)|.*?)");

        String colorStringNoWS = colorString.replace(" ", "");
        Matcher m = pattern.matcher(colorStringNoWS);

        if (m.find()) {
            int red = Integer.parseInt(m.group(1));
            int green = Integer.parseInt(m.group(2));
            int blue = Integer.parseInt(m.group(3));
            int alpha = 255;
            if (m.groupCount() == 5) {
                Pattern alphaPattern = Pattern.compile("[\\d|\\.]+");
                Matcher alphaMatch = alphaPattern.matcher(m.group(4));
                if (alphaMatch.find()) {
                    alpha = (int)(Double.parseDouble(alphaMatch.group(0)) * 255);
                }
            }
            return Color.argb(alpha, red, green, blue);
        } else {
            try {
                return Color.parseColor(colorString);
            }
            catch(Exception ex) {
                return Color.BLACK;
            }
        }
    }
}
