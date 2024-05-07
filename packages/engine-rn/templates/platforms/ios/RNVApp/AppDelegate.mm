#import "AppDelegate.h"

#import <React/RCTRootView.h>
#if RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#endif
#import <React/RCTBundleURLProvider.h>
{{APPDELEGATE_MM_IMPORTS}}

@implementation AppDelegate

{{APPDELEGATE_METHODS}}

- (UIView *)createRootViewWithBridge:(RCTBridge *)bridge
                          moduleName:(NSString *)moduleName
                           initProps:(NSDictionary *)initProps
{
  UIView * view = [super createRootViewWithBridge:bridge moduleName:moduleName initProps:initProps];
  
#if RCT_NEW_ARCH_ENABLED
  RCTFabricSurfaceHostingProxyRootView * rootView = (RCTFabricSurfaceHostingProxyRootView *)view;
#else
  RCTRootView * rootView = (RCTRootView *)view;
#endif
  
  // workaround:
  UIStoryboard *sb = [UIStoryboard storyboardWithName:@"LaunchScreen" bundle:nil];
  UIViewController *vc = [sb instantiateInitialViewController];
  rootView.loadingView = vc.view;

  return rootView;
}

@end
