#import "RNSimpleCompass.h"
#import <React/RCTEventDispatcher.h>
#import <Corelocation/CoreLocation.h>

#define kHeadingUpdated @"HeadingUpdated"

@interface RNSimpleCompass() <CLLocationManagerDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;
@end

@implementation RNSimpleCompass

- (instancetype)init {
    if (self = [super init]) {
        if ([CLLocationManager headingAvailable]) {
            self.locationManager = [[CLLocationManager alloc] init];
            self.locationManager.delegate = self;
        }
        else {
            NSLog(@"Heading not available");
        }
    }

    return self;
}

#pragma mark - RCTEventEmitter

- (NSArray<NSString *> *)supportedEvents {
    return @[kHeadingUpdated];
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)newHeading {
    if (newHeading.headingAccuracy < 0) {
        return;
    }
    [self sendEventWithName:kHeadingUpdated body:@(newHeading.trueHeading)];
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    NSLog(@"AuthoriationStatus changed: %i", status);
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    NSLog(@"Location manager failed: %@", error);
}

- (BOOL)locationManagerShouldDisplayHeadingCalibration:(CLLocationManager *)manager
{
    CLLocationDirection accuracy = [[manager heading] headingAccuracy];
    return accuracy <= 0.0f || accuracy > 10.0f;
}

#pragma mark - React

RCT_EXPORT_METHOD(start: (NSInteger) headingFilter) {
    if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusNotDetermined) {
        NSLog(@"Requesting permission");
        [self.locationManager requestWhenInUseAuthorization];
    }
    self.locationManager.headingFilter = headingFilter;
    [self.locationManager startUpdatingHeading];
}

RCT_EXPORT_METHOD(stop) {
    [self.locationManager stopUpdatingHeading];
}

RCT_EXPORT_MODULE()

@end
