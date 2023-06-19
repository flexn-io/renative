package com.como.RNTShadowView;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.util.Log;

public class BlurBuilder {

    public static Bitmap blur(Context context, Bitmap image, float blurRadius) {
        // Override
        // blurRadius can't be 0 since Math.sqrt is failing
        blurRadius = blurRadius == 0 ? 1 : blurRadius;
        // End of Override
        float scale  = (1.3f / (float)Math.sqrt(blurRadius * Resources.getSystem().getDisplayMetrics().density)) ;
        blurRadius = blurRadius * 2;
        blurRadius  = Math.max(8, Math.min(25, blurRadius));
        return blur(context, image, blurRadius, scale);
    }

    public static Bitmap blur(Context context, Bitmap image, float blurRadius, float scale) {
        int width = Math.round(image.getWidth() * scale);
        int height = Math.round(image.getHeight() * scale);

        Bitmap inputBitmap = Bitmap.createScaledBitmap(image, width, height, false);
        Bitmap outputBitmap = Bitmap.createBitmap(inputBitmap);

        RenderScript rs = RenderScript.create(context);

        ScriptIntrinsicBlur intrinsicBlur = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
        Allocation tmpIn = Allocation.createFromBitmap(rs, inputBitmap);
        Allocation tmpOut = Allocation.createFromBitmap(rs, outputBitmap);

        intrinsicBlur.setRadius(blurRadius);
        intrinsicBlur.setInput(tmpIn);
        intrinsicBlur.forEach(tmpOut);
        tmpOut.copyTo(outputBitmap);

        return outputBitmap;
    }
}


