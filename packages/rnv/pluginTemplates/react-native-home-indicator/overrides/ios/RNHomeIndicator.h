#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>


@interface HomeIndicatorViewController : UIViewController
@property BOOL prefersAutoHidden;
@end

@interface RNHomeIndicator : NSObject <RCTBridgeModule>
@end