
//  Magnetometer.m


#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>
#import "Magnetometer.h"

@implementation Magnetometer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"Magnetometer"];
}

- (id) init {
    self = [super init];
    NSLog(@"Magnetometer");

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
    if([self->_motionManager isMagnetometerAvailable])
    {
        /* Start the accelerometer if it is not active already */
        if([self->_motionManager isMagnetometerActive] == NO)
        {
            resolve(@YES);
        } else {
            reject(@"-1", @"Magnetometer is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"Magnetometer is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    NSLog(@"setUpdateInterval: %f", interval);
    double intervalInSeconds = interval / 1000;

    [self->_motionManager setMagnetometerUpdateInterval:intervalInSeconds];
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    double interval = self->_motionManager.magnetometerUpdateInterval;
    NSLog(@"getUpdateInterval: %f", interval);
    cb(@[[NSNull null], [NSNumber numberWithDouble:interval]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {
    double x = self->_motionManager.magnetometerData.magneticField.x;
    double y = self->_motionManager.magnetometerData.magneticField.y;
    double z = self->_motionManager.magnetometerData.magneticField.z;
    double timestamp = self->_motionManager.magnetometerData.timestamp;

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
    [self->_motionManager startMagnetometerUpdates];

    /* Receive the magnetometer data on this block */
    [self->_motionManager startMagnetometerUpdatesToQueue:[NSOperationQueue mainQueue]
                                               withHandler:^(CMMagnetometerData *magnetometerData, NSError *error)
     {
         double x = magnetometerData.magneticField.x;
         double y = magnetometerData.magneticField.y;
         double z = magnetometerData.magneticField.z;
         double timestamp = magnetometerData.timestamp;
         NSLog(@"startMagnetometerUpdates: %f, %f, %f, %f", x, y, z, timestamp);

         [self sendEventWithName:@"Magnetometer" body:@{
                                                                                   @"x" : [NSNumber numberWithDouble:x],
                                                                                   @"y" : [NSNumber numberWithDouble:y],
                                                                                   @"z" : [NSNumber numberWithDouble:z],
                                                                                   @"timestamp" : [NSNumber numberWithDouble:timestamp]
                                                                               }];
     }];

}

RCT_EXPORT_METHOD(stopUpdates) {
    NSLog(@"stopUpdates");
    [self->_motionManager stopMagnetometerUpdates];
}

@end
