package com.como.RNTShadowView;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.views.view.ReactViewGroup;

public class ShadowView extends ReactViewGroup {
    int shadowOffsetX = 0;
    int shadowOffsetY = (int)(-2 * Resources.getSystem().getDisplayMetrics().density);
    int shadowRadius = 0;
    int borderRadius = 0;
    int shadowColor;
    int shadowColorToDraw;
    int borderShadowColor;
    int shadowOpacity;
    int margin;
    double borderWidth;

    Paint viewPaint = new Paint();
    Paint borderPaint = new Paint();

    Bitmap shadowBitmap = null;

    public ShadowView(Context context) {
        super(context);
        init();
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        if (changed) {
            // Override to prevent crashing if size is 0
            if (getWidth() == 0 || getHeight() == 0) {
                return;
            }
            shadowBitmap = createShadowForView();
            invalidate();
        }
    }

    @Override
    public void setBackgroundColor(int color) {
        super.setBackgroundColor(Color.TRANSPARENT);
        viewPaint.setColor(color);
        createShadowColor();
        invalidate();
    }

    private void init() {
        setLayerType(View.LAYER_TYPE_NONE, viewPaint);
        viewPaint.setAntiAlias(true);
        borderPaint.setAntiAlias(true);
        borderPaint.setStyle(Paint.Style.STROKE);
        borderPaint.setColor(Color.BLACK);
        shadowColor = Color.BLACK;
        shadowColorToDraw = Color.BLACK;

        createShadowColor();
        invalidate();
    }

    public void setShadowBorderRadius(double borderRadius) {
        this.borderRadius=(int) (borderRadius * Resources.getSystem().getDisplayMetrics().density);
        invalidate();
    }

    public void setShadowOffsetX(double shadowOffsetX) {
        this.shadowOffsetX = (int)((shadowOffsetX * Resources.getSystem().getDisplayMetrics().density));
        invalidate();
    }

    public void setShadowOffsetY(double shadowOffsetY) {
        this.shadowOffsetY = (int)((shadowOffsetY * Resources.getSystem().getDisplayMetrics().density));
        invalidate();
    }

    public void setShadowColor(int shadowColor) {
        this.shadowColor = shadowColor;
        createShadowColor();
        invalidate();
    }

    public void setShadowOpacity(double shadowOpacity) {
        shadowOpacity = Math.min(Math.max(0, shadowOpacity), 1);
        this.shadowOpacity = (int)(shadowOpacity * 255);
        this.createShadowColor();
        invalidate();
    }

    public void setShadowRadius(double shadowRadius) {
        shadowRadius = Math.max(0.2, shadowRadius);
        this.shadowRadius = (int)shadowRadius;
        this.margin = (int)(this.shadowRadius * 6.2);
        invalidate();
    }

    public void setBorderColor(int borderColor) {
        borderPaint.setColor(borderColor);
        createShadowColor();
        invalidate();
    }

//    public void setBorderWidth(double borderWidth) {
////        this.borderWidth = (borderWidth * Resources.getSystem().getDisplayMetrics().density * 1.1);
//        this.borderWidth = 3;
//        invalidate();
//    }

    private void createShadowColor() {
        int red = Color.red(shadowColor);
        int green = Color.green(shadowColor);
        int blue = Color.blue(shadowColor);
        int shadowColorAlpha = Color.alpha(shadowColor);
        int borderColorAlpha = Color.alpha(borderPaint.getColor());
        int shadowAlpha = (int)((double)shadowOpacity * ((double)shadowColorAlpha/255.0) );
        int borderShadowAlpha = (int)((double)shadowOpacity * ((double)borderColorAlpha/255.0));
        shadowColorToDraw = Color.argb(shadowAlpha, red, green, blue);
        borderShadowColor = Color.argb(borderShadowAlpha, red, green, blue);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // Override to prevent crashing if size is 0
        if (getWidth() == 0 || getHeight() == 0) {
            return;
        }

        Rect imageRect = new Rect(0, 0, shadowBitmap.getWidth(), shadowBitmap.getHeight());
        Rect targetRect = new Rect(shadowOffsetX - margin, shadowOffsetY - margin, getWidth() + margin + shadowOffsetX, getHeight() + margin + shadowOffsetY);
        canvas.drawBitmap(shadowBitmap, imageRect, targetRect, viewPaint);

        Object contentRect = new RectF(0, 0, getWidth(), getHeight());
        canvas.drawRoundRect((RectF)contentRect, borderRadius, borderRadius, viewPaint);

    }

    public Bitmap createShadowForView() {
        Bitmap bitmap = Bitmap.createBitmap(getWidth() + margin * 2, getHeight()+ margin * 2, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint shadowPaint = new Paint();
        shadowPaint.setAntiAlias(true);
        shadowPaint.setColor(shadowColorToDraw);
        canvas.drawRoundRect( new RectF(margin, margin, bitmap.getWidth() - margin, bitmap.getHeight() - margin), borderRadius, borderRadius, shadowPaint);
        return com.como.RNTShadowView.BlurBuilder.blur(getContext(), bitmap, shadowRadius);
    }
}
