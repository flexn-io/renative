// Inspired by https://github.com/pwmckenna/react-native-motion-manager

#import "Gyroscope.h"
#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>

@implementation Gyroscope

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"Gyroscope"];
}

- (id) init {
    self = [super init];
    NSLog(@"Gyroscope");

    if (self) {
        self->_motionManager = [[CMMotionManager alloc] init];
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
    if([self->_motionManager isGyroAvailable])
    {
        /* Start the accelerometer if it is not active already */
        if([self->_motionManager isGyroActive] == NO)
        {
            resolve(@YES);
        } else {
            reject(@"-1", @"Gyroscope is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"Gyroscope is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    NSLog(@"setGyroUpdateInterval: %f", interval);
    double intervalInSeconds = interval / 1000;

    [self->_motionManager setGyroUpdateInterval:intervalInSeconds];
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    double interval = self->_motionManager.gyroUpdateInterval;
    NSLog(@"getUpdateInterval: %f", interval);
    cb(@[[NSNull null], [NSNumber numberWithDouble:interval]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {
    double x = self->_motionManager.gyroData.rotationRate.x;
    double y = self->_motionManager.gyroData.rotationRate.y;
    double z = self->_motionManager.gyroData.rotationRate.z;
    double timestamp = self->_motionManager.gyroData.timestamp;

    NSLog(@"getData: %f, %f, %f, %f", x, y, z, timestamp);

    cb(@[[NSNull null], @{
                 @"x" : [NSNumber numberWithDouble:x],
                 @"y" : [NSNumber numberWithDouble:y],
                 @"z" : [NSNumber numberWithDouble:z],
                 @"timestamp" : [NSNumber numberWithDouble:timestamp]
             }]
       );
}

RCT_EXPORT_METHOD(startUpdates) {
    NSLog(@"startUpdates");
    [self->_motionManager startGyroUpdates];

    /* Receive the gyroscope data on this block */
    [self->_motionManager startGyroUpdatesToQueue:[NSOperationQueue mainQueue]
                                      withHandler:^(CMGyroData *gyroData, NSError *error)
     {
         double x = gyroData.rotationRate.x;
         double y = gyroData.rotationRate.y;
         double z = gyroData.rotationRate.z;
         double timestamp = gyroData.timestamp;
         NSLog(@"startUpdates: %f, %f, %f, %f", x, y, z, timestamp);

         [self sendEventWithName:@"Gyroscope" body:@{
                                                                                     @"x" : [NSNumber numberWithDouble:x],
                                                                                     @"y" : [NSNumber numberWithDouble:y],
                                                                                     @"z" : [NSNumber numberWithDouble:z],
                                                                                     @"timestamp" : [NSNumber numberWithDouble:timestamp]
                                                                                 }];
     }];

}

RCT_EXPORT_METHOD(stopUpdates) {
    NSLog(@"stopUpdates");
    [self->_motionManager stopGyroUpdates];
}

@end
