package com.rssignaturecapture;

import android.content.Context;

import android.content.res.Resources;
import android.content.res.TypedArray;

import android.util.Log;
import android.view.View;
import android.view.MotionEvent;

import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Canvas;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.RectF;

import android.util.DisplayMetrics;

import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;

import java.util.ArrayList;
import java.util.List;

import com.rssignaturecapture.utils.TimedPoint;
import com.rssignaturecapture.utils.ControlTimedPoints;
import com.rssignaturecapture.utils.Bezier;

public class RSSignatureCaptureView extends View {
	private static final float STROKE_WIDTH = 5f;
	private static final float HALF_STROKE_WIDTH = STROKE_WIDTH / 2;

	private boolean mIsEmpty;
	private OnSignedListener mOnSignedListener;
	private int mMinWidth;
	private int mMaxWidth;
	private float mLastTouchX;
	private float mLastTouchY;
	private float mLastVelocity;
	private float mLastWidth;
	private RectF mDirtyRect;

	private List<TimedPoint> mPoints;
	private Paint mPaint = new Paint();
	private Path mPath = new Path();
	private Bitmap mSignatureBitmap = null;

	private float mVelocityFilterWeight;
	private Canvas mSignatureBitmapCanvas = null;
	private SignatureCallback callback;
	private boolean dragged = false;
	private boolean multipleTouchDragged = false;
	private int SCROLL_THRESHOLD = 5;

	public interface SignatureCallback {
		void onDragged();
	}

	public RSSignatureCaptureView(Context context, SignatureCallback callback) {

		super(context);
		this.callback = callback;

		//Fixed parameters
		mPaint.setAntiAlias(true);
		mPaint.setStyle(Paint.Style.STROKE);
		mPaint.setStrokeCap(Paint.Cap.ROUND);
		mPaint.setStrokeJoin(Paint.Join.ROUND);

		mMinWidth = convertDpToPx(4);
		mMaxWidth = convertDpToPx(8);
		mVelocityFilterWeight = 0.4f;
		mPaint.setColor(Color.BLACK);

		//Dirty rectangle to update only the changed portion of the view
		mDirtyRect = new RectF();

		clear();

		// set the bg color as white
		this.setBackgroundColor(Color.WHITE);

		// width and height should cover the screen
		this.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
	}

	/**
	* Get signature
	*
	* @return
	*/
	public Bitmap getSignature() {

		Bitmap signatureBitmap = null;

		// set the signature bitmap
		if (signatureBitmap == null) {
			signatureBitmap = Bitmap.createBitmap(this.getWidth(), this.getHeight(), Bitmap.Config.ARGB_8888);
		}

		// important for saving signature
		final Canvas canvas = new Canvas(signatureBitmap);
		this.draw(canvas);

		return signatureBitmap;
	}


	/**
	* clear signature canvas
	*/
	public void clearSignature() {
		clear();
	}

	private void addPoint(TimedPoint newPoint) {
		mPoints.add(newPoint);
		if (mPoints.size() > 2) {
			// To reduce the initial lag make it work with 3 mPoints
			// by copying the first point to the beginning.
			if (mPoints.size() == 3) mPoints.add(0, mPoints.get(0));

			ControlTimedPoints tmp = calculateCurveControlPoints(mPoints.get(0), mPoints.get(1), mPoints.get(2));
			TimedPoint c2 = tmp.c2;
			tmp = calculateCurveControlPoints(mPoints.get(1), mPoints.get(2), mPoints.get(3));
			TimedPoint c3 = tmp.c1;
			Bezier curve = new Bezier(mPoints.get(1), c2, c3, mPoints.get(2));

			TimedPoint startPoint = curve.startPoint;
			TimedPoint endPoint = curve.endPoint;

			float velocity = endPoint.velocityFrom(startPoint);
			velocity = Float.isNaN(velocity) ? 0.0f : velocity;

			velocity = mVelocityFilterWeight * velocity
					+ (1 - mVelocityFilterWeight) * mLastVelocity;

			// The new width is a function of the velocity. Higher velocities
			// correspond to thinner strokes.
			float newWidth = strokeWidth(velocity);

			// The Bezier's width starts out as last curve's final width, and
			// gradually changes to the stroke width just calculated. The new
			// width calculation is based on the velocity between the Bezier's
			// start and end mPoints.
			addBezier(curve, mLastWidth, newWidth);

			mLastVelocity = velocity;
			mLastWidth = newWidth;

			// Remove the first element from the list,
			// so that we always have no more than 4 mPoints in mPoints array.
			mPoints.remove(0);
		}
	}

	private void addBezier(Bezier curve, float startWidth, float endWidth) {
		ensureSignatureBitmap();
		float originalWidth = mPaint.getStrokeWidth();
		float widthDelta = endWidth - startWidth;
		float drawSteps = (float) Math.floor(curve.length());

		for (int i = 0; i < drawSteps; i++) {
			// Calculate the Bezier (x, y) coordinate for this step.
			float t = ((float) i) / drawSteps;
			float tt = t * t;
			float ttt = tt * t;
			float u = 1 - t;
			float uu = u * u;
			float uuu = uu * u;

			float x = uuu * curve.startPoint.x;
			x += 3 * uu * t * curve.control1.x;
			x += 3 * u * tt * curve.control2.x;
			x += ttt * curve.endPoint.x;

			float y = uuu * curve.startPoint.y;
			y += 3 * uu * t * curve.control1.y;
			y += 3 * u * tt * curve.control2.y;
			y += ttt * curve.endPoint.y;

			// Set the incremental stroke width and draw.
			mPaint.setStrokeWidth(startWidth + ttt * widthDelta);
			mSignatureBitmapCanvas.drawPoint(x, y, mPaint);
			expandDirtyRect(x, y);
		}

		mPaint.setStrokeWidth(originalWidth);
	}

	private void ensureSignatureBitmap() {
		if (mSignatureBitmap == null) {
			mSignatureBitmap = Bitmap.createBitmap(getWidth(), getHeight(),
					Bitmap.Config.ARGB_8888);
			mSignatureBitmapCanvas = new Canvas(mSignatureBitmap);
		}
	}

	public void setMinStrokeWidth(int minStrokeWidth) {
		mMinWidth = minStrokeWidth;
	}

	public void setMaxStrokeWidth(int maxStrokeWidth) {
		mMaxWidth = maxStrokeWidth;
	}

	public void setStrokeColor(int color) {
		mPaint.setColor(color);
	}

	private float strokeWidth(float velocity) {
		return Math.max(mMaxWidth / (velocity + 1), mMinWidth);
	}

	private ControlTimedPoints calculateCurveControlPoints(TimedPoint s1, TimedPoint s2, TimedPoint s3) {
		float dx1 = s1.x - s2.x;
		float dy1 = s1.y - s2.y;
		float dx2 = s2.x - s3.x;
		float dy2 = s2.y - s3.y;

		TimedPoint m1 = new TimedPoint((s1.x + s2.x) / 2.0f, (s1.y + s2.y) / 2.0f);
		TimedPoint m2 = new TimedPoint((s2.x + s3.x) / 2.0f, (s2.y + s3.y) / 2.0f);

		float l1 = (float) Math.sqrt(dx1 * dx1 + dy1 * dy1);
		float l2 = (float) Math.sqrt(dx2 * dx2 + dy2 * dy2);

		float dxm = (m1.x - m2.x);
		float dym = (m1.y - m2.y);
		float k = l2 / (l1 + l2);
		TimedPoint cm = new TimedPoint(m2.x + dxm * k, m2.y + dym * k);

		float tx = s2.x - cm.x;
		float ty = s2.y - cm.y;

		return new ControlTimedPoints(new TimedPoint(m1.x + tx, m1.y + ty), new TimedPoint(m2.x + tx, m2.y + ty));
	}

	@Override
	public boolean onTouchEvent(MotionEvent event) {
		if (!isEnabled() || event.getPointerCount() > 1 || (multipleTouchDragged && event.getAction() != MotionEvent.ACTION_UP)) {
		    multipleTouchDragged = true;
			return false;
		}

		float eventX = event.getX();
		float eventY = event.getY();

		switch (event.getAction()) {
			case MotionEvent.ACTION_DOWN:
                mLastTouchX = eventX;
                mLastTouchY = eventY;
				getParent().requestDisallowInterceptTouchEvent(true);
				mPoints.clear();
				mPath.moveTo(eventX, eventY);
				addPoint(new TimedPoint(eventX, eventY));

			case MotionEvent.ACTION_MOVE:
                if((Math.abs(mLastTouchX - eventX) < SCROLL_THRESHOLD || Math.abs(mLastTouchY - eventY) < SCROLL_THRESHOLD) && dragged) {
                    return false;
                }
				resetDirtyRect(eventX, eventY);
				addPoint(new TimedPoint(eventX, eventY));
                dragged = true;
				break;

			case MotionEvent.ACTION_UP:
			    if(mPoints.size() >= 3) {
                    resetDirtyRect(eventX, eventY);
                    addPoint(new TimedPoint(eventX, eventY));
                    getParent().requestDisallowInterceptTouchEvent(true);
                    setIsEmpty(false);
                    sendDragEventToReact();
			    }
                dragged = false;
                multipleTouchDragged = false;
				break;

			default:
				return false;
		}

		//invalidate();
		invalidate(
				(int) (mDirtyRect.left - mMaxWidth),
				(int) (mDirtyRect.top - mMaxWidth),
				(int) (mDirtyRect.right + mMaxWidth),
				(int) (mDirtyRect.bottom + mMaxWidth));

		return true;
	}

	public void sendDragEventToReact() {
		if (callback != null && dragged) {
			callback.onDragged();
		}
	}

	// all touch events during the drawing
	@Override
	protected void onDraw(Canvas canvas) {
		if (mSignatureBitmap != null) {
			canvas.drawBitmap(mSignatureBitmap, 0, 0, mPaint);
		}
	}


	/**
	 * Called when replaying history to ensure the dirty region includes all
	 * mPoints.
	 *
	 * @param historicalX the previous x coordinate.
	 * @param historicalY the previous y coordinate.
	 */
	private void expandDirtyRect(float historicalX, float historicalY) {
		if (historicalX < mDirtyRect.left) {
			mDirtyRect.left = historicalX;
		} else if (historicalX > mDirtyRect.right) {
			mDirtyRect.right = historicalX;
		}
		if (historicalY < mDirtyRect.top) {
			mDirtyRect.top = historicalY;
		} else if (historicalY > mDirtyRect.bottom) {
			mDirtyRect.bottom = historicalY;
		}
	}

	/**
	 * Resets the dirty region when the motion event occurs.
	 *
	 * @param eventX the event x coordinate.
	 * @param eventY the event y coordinate.
	 */
	private void resetDirtyRect(float eventX, float eventY) {

		// The mLastTouchX and mLastTouchY were set when the ACTION_DOWN motion event occurred.
		mDirtyRect.left = Math.min(mLastTouchX, eventX);
		mDirtyRect.right = Math.max(mLastTouchX, eventX);
		mDirtyRect.top = Math.min(mLastTouchY, eventY);
		mDirtyRect.bottom = Math.max(mLastTouchY, eventY);
	}


	private void setIsEmpty(boolean newValue) {
		mIsEmpty = newValue;
		if (mOnSignedListener != null) {
			if (mIsEmpty) {
				mOnSignedListener.onClear();
			} else {
				mOnSignedListener.onSigned();
			}
		}
	}

	public void clear() {
		dragged = false;
		mPoints = new ArrayList<TimedPoint>();
		mLastVelocity = 0;
		mLastWidth = (mMinWidth + mMaxWidth) / 2;
		mPath.reset();

		if (mSignatureBitmap != null) {
			mSignatureBitmap = null;
			ensureSignatureBitmap();
		}

		setIsEmpty(true);

		invalidate();
	}

	private int convertDpToPx(float dp){
		return Math.round(dp*(getResources().getDisplayMetrics().xdpi/ DisplayMetrics.DENSITY_DEFAULT));
	}

	public interface OnSignedListener {
		public void onSigned();

		public void onClear();
	}
}