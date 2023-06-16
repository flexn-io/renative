//  Barometer.m


#import "Barometer.h"
#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>
#import <CoreMotion/CoreMotion.h>

@implementation Barometer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"Barometer"];
}

- (id) init {
    self = [super init];
    NSLog(@"Barometer");

    if (self) {
        self->_altimeter = [[CMAltimeter alloc] init];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_REMAP_METHOD(isAvailable,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    return [self isAvailableWithResolver:resolve
                                rejecter:reject];
}

- (void) isAvailableWithResolver:(RCTPromiseResolveBlock) resolve
                        rejecter:(RCTPromiseRejectBlock) reject {

    if ([CMAltimeter isRelativeAltitudeAvailable])
    {
        resolve(@YES);
    }
    else
    {
        reject(@"-1", @"Barometer is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    NSLog(@"Can not set update interval for barometer, doing nothing");
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    NSLog(@"getUpdateInterval is not meaningul for a barometer sensor");
    cb(@[[NSNull null], [NSNumber numberWithDouble:0.0]]);
}

RCT_EXPORT_METHOD(startUpdates) {
    NSLog(@"startUpdates");

    [self->_altimeter startRelativeAltitudeUpdatesToQueue:[NSOperationQueue mainQueue] withHandler:^(CMAltitudeData * _Nullable altitudeData, NSError * _Nullable error) {
        if (error) {
            NSLog(@"error while getting sensor data");
        }

        if (altitudeData) {
            [self sendEventWithName:@"Barometer" body:@{
                @"pressure" : @(altitudeData.pressure.doubleValue * 10.0)
            }];
        }

    }];
}

RCT_EXPORT_METHOD(stopUpdates) {
    NSLog(@"stopUpdates");
    [self->_altimeter stopRelativeAltitudeUpdates];
}

@end
