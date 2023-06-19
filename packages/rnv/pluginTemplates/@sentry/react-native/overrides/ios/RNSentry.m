#import "RNSentry.h"

#if __has_include(<React/RCTConvert.h>)
#import <React/RCTConvert.h>
#else
#import "RCTConvert.h"
#endif

#import <Sentry/Sentry.h>
#import <Sentry/SentryScreenFrames.h>

@interface SentrySDK (RNSentry)

+ (void)captureEnvelope:(SentryEnvelope *)envelope;

+ (void)storeEnvelope:(SentryEnvelope *)envelope;

@end

static bool didFetchAppStart;

@implementation RNSentry {
    bool sentHybridSdkDidBecomeActive;
    SentryOptions *sentryOptions;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_MODULE()

- (NSDictionary<NSString *, id> *)constantsToExport
{
    return @{@"nativeClientAvailable": @YES, @"nativeTransport": @YES};
}

RCT_EXPORT_METHOD(initNativeSdk:(NSDictionary *_Nonnull)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    PrivateSentrySDKOnly.appStartMeasurementHybridSDKMode = true;

    NSError *error = nil;

    SentryBeforeSendEventCallback beforeSend = ^SentryEvent*(SentryEvent *event) {
        // We don't want to send an event after startup that came from a Unhandled JS Exception of react native
        // Because we sent it already before the app crashed.
        if (nil != event.exceptions.firstObject.type &&
            [event.exceptions.firstObject.type rangeOfString:@"Unhandled JS Exception"].location != NSNotFound) {
            NSLog(@"Unhandled JS Exception");
            return nil;
        }

        [self setEventOriginTag:event];

        return event;
    };

    [options setValue:beforeSend forKey:@"beforeSend"];

    sentryOptions = [[SentryOptions alloc] initWithDict:options didFailWithError:&error];
    if (error) {
        reject(@"SentryReactNative", error.localizedDescription, error);
        return;
    }
    [SentrySDK startWithOptionsObject:sentryOptions];

//    // If the app is active/in foreground, and we have not sent the SentryHybridSdkDidBecomeActive notification, send it.
#if !TARGET_OS_OSX
    if ([[UIApplication sharedApplication] applicationState] == UIApplicationStateActive && !sentHybridSdkDidBecomeActive && sentryOptions.enableAutoSessionTracking) {
        [[NSNotificationCenter defaultCenter]
            postNotificationName:@"SentryHybridSdkDidBecomeActive"
            object:nil];

        sentHybridSdkDidBecomeActive = true;
    }
#endif



    resolve(@YES);
}

- (void)setEventOriginTag:(SentryEvent *)event {
  if (event.sdk != nil) {
    NSString *sdkName = event.sdk[@"name"];

    // If the event is from react native, it gets set there and we do not handle
    // it here.
    if ([sdkName isEqualToString:@"sentry.cocoa"]) {
      [self setEventEnvironmentTag:event origin:@"ios" environment:@"native"];
    }
  }
}

- (void)setEventEnvironmentTag:(SentryEvent *)event
                        origin:(NSString *)origin
                   environment:(NSString *)environment {
  NSMutableDictionary *newTags = [NSMutableDictionary new];

  if (nil != event.tags && [event.tags count] > 0) {
    [newTags addEntriesFromDictionary:event.tags];
  }
  if (nil != origin) {
    [newTags setValue:origin forKey:@"event.origin"];
  }
  if (nil != environment) {
    [newTags setValue:environment forKey:@"event.environment"];
  }

  event.tags = newTags;
}

RCT_EXPORT_METHOD(fetchNativeSdkInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (sentryOptions == nil) {
        return reject(@"SentryReactNative",@"Called fetchNativeSdkInfo without initializing the SDK first.", nil);
    }

    resolve(@{
        @"name": sentryOptions.sdkInfo.name,
        @"version": sentryOptions.sdkInfo.version
            });
}

RCT_EXPORT_METHOD(fetchNativeDeviceContexts:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"Bridge call to: deviceContexts");
    // Temp work around until sorted out this API in sentry-cocoa.
    // TODO: If the callback isnt' executed the promise wouldn't be resolved.
    [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
        NSDictionary<NSString *, id> *serializedScope = [scope serialize];
        // Scope serializes as 'context' instead of 'contexts' as it does for the event.
        NSDictionary<NSString *, id> *contexts = [serializedScope valueForKey:@"context"];
#if DEBUG
        NSData *data = [NSJSONSerialization dataWithJSONObject:contexts options:0 error:nil];
        NSString *debugContext = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"Contexts: %@", debugContext);
#endif
        resolve(contexts);
    }];
}

RCT_EXPORT_METHOD(fetchNativeAppStart:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{

    SentryAppStartMeasurement *appStartMeasurement = PrivateSentrySDKOnly.appStartMeasurement;

    if (appStartMeasurement == nil) {
        resolve(nil);
    } else {
        BOOL isColdStart = appStartMeasurement.type == SentryAppStartTypeCold;

        resolve(@{
            @"isColdStart": [NSNumber numberWithBool:isColdStart],
            @"appStartTime": [NSNumber numberWithDouble:(appStartMeasurement.appStartTimestamp.timeIntervalSince1970 * 1000)],
            @"didFetchAppStart": [NSNumber numberWithBool:didFetchAppStart],
                });

    }

    // This is always set to true, as we would only allow an app start fetch to only happen once
    // in the case of a JS bundle reload, we do not want it to be instrumented again.
    didFetchAppStart = true;
}

#if !TARGET_OS_OSX
RCT_EXPORT_METHOD(fetchNativeFrames:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{

    if (PrivateSentrySDKOnly.isFramesTrackingRunning) {
        SentryScreenFrames *frames = PrivateSentrySDKOnly.currentScreenFrames;

        if (frames == nil) {
            resolve(nil);
        }

        resolve(@{
            @"totalFrames": [NSNumber numberWithLong:frames.total],
            @"frozenFrames": [NSNumber numberWithLong:frames.frozen],
            @"slowFrames": [NSNumber numberWithLong:frames.slow],
        });
    } else {
      resolve(nil);
    }
}
#endif

RCT_EXPORT_METHOD(fetchNativeRelease:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSDictionary *infoDict = [[NSBundle mainBundle] infoDictionary];
    resolve(@{
              @"id": infoDict[@"CFBundleIdentifier"],
              @"version": infoDict[@"CFBundleShortVersionString"],
              @"build": infoDict[@"CFBundleVersion"],
              });
}

RCT_EXPORT_METHOD(captureEnvelope:(NSDictionary * _Nonnull)envelopeDict
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if ([NSJSONSerialization isValidJSONObject:envelopeDict]) {
        SentrySdkInfo *sdkInfo = [[SentrySdkInfo alloc] initWithDict:envelopeDict[@"header"]];
        SentryId *eventId = [[SentryId alloc] initWithUUIDString:envelopeDict[@"header"][@"event_id"]];
        SentryEnvelopeHeader *envelopeHeader = [[SentryEnvelopeHeader alloc] initWithId:eventId sdkInfo:sdkInfo traceState:nil];

        NSError *error;
        NSData *envelopeItemData = [NSJSONSerialization dataWithJSONObject:envelopeDict[@"payload"] options:0 error:&error];
        if (nil != error) {
            reject(@"SentryReactNative", @"Cannot serialize event", error);
        }

        NSString *itemType = envelopeDict[@"payload"][@"type"];
        if (itemType == nil) {
            // Default to event type.
            itemType = @"event";
        }

        SentryEnvelopeItemHeader *envelopeItemHeader = [[SentryEnvelopeItemHeader alloc] initWithType:itemType length:envelopeItemData.length];
        SentryEnvelopeItem *envelopeItem = [[SentryEnvelopeItem alloc] initWithHeader:envelopeItemHeader data:envelopeItemData];

        SentryEnvelope *envelope = [[SentryEnvelope alloc] initWithHeader:envelopeHeader singleItem:envelopeItem];

        #if DEBUG
            [SentrySDK captureEnvelope:envelope];
        #else
            if ([envelopeDict[@"payload"][@"level"] isEqualToString:@"fatal"]) {
                // Storing to disk happens asynchronously with captureEnvelope
                [SentrySDK storeEnvelope:envelope];
            } else {
                [SentrySDK captureEnvelope:envelope];
            }
        #endif
        resolve(@YES);
    } else {
        reject(@"SentryReactNative", @"Cannot serialize event", nil);
    }
}

RCT_EXPORT_METHOD(setUser:(NSDictionary *)user
                  otherUserKeys:(NSDictionary *)otherUserKeys
)
{
    [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
        if (nil == user && nil == otherUserKeys) {
            [scope setUser:nil];
        } else {
            SentryUser* userInstance = [[SentryUser alloc] init];

            if (nil != user) {
                [userInstance setUserId:user[@"id"]];
                [userInstance setEmail:user[@"email"]];
                [userInstance setUsername:user[@"username"]];
            }

            if (nil != otherUserKeys) {
                [userInstance setData:otherUserKeys];
            }

            [scope setUser:userInstance];
        }
    }];
}

RCT_EXPORT_METHOD(addBreadcrumb:(NSDictionary *)breadcrumb)
{
    [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
        SentryBreadcrumb* breadcrumbInstance = [[SentryBreadcrumb alloc] init];

        NSString * levelString = breadcrumb[@"level"];
        SentryLevel sentryLevel;
        if ([levelString isEqualToString:@"fatal"]) {
            sentryLevel = kSentryLevelFatal;
        } else if ([levelString isEqualToString:@"warning"]) {
            sentryLevel = kSentryLevelWarning;
        } else if ([levelString isEqualToString:@"info"]) {
            sentryLevel = kSentryLevelInfo;
        } else if ([levelString isEqualToString:@"debug"]) {
            sentryLevel = kSentryLevelDebug;
        } else {
            sentryLevel = kSentryLevelError;
        }
        [breadcrumbInstance setLevel:sentryLevel];

        [breadcrumbInstance setCategory:breadcrumb[@"category"]];

        [breadcrumbInstance setType:breadcrumb[@"type"]];

        [breadcrumbInstance setMessage:breadcrumb[@"message"]];

        [breadcrumbInstance setData:breadcrumb[@"data"]];

        [scope addBreadcrumb:breadcrumbInstance];
    }];
}

RCT_EXPORT_METHOD(clearBreadcrumbs) {
    [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
        [scope clearBreadcrumbs];
    }];
}

RCT_EXPORT_METHOD(setExtra:(NSString *)key
                  extra:(NSString *)extra
)
{
    [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
        [scope setExtraValue:extra forKey:key];
    }];
}

RCT_EXPORT_METHOD(setContext:(NSString *)key
                  context:(NSDictionary *)context
)
{
    [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
        [scope setContextValue:context forKey:key];
    }];
}

RCT_EXPORT_METHOD(setTag:(NSString *)key
                  value:(NSString *)value
)
{
    [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
        [scope setTagValue:value forKey:key];
    }];
}

RCT_EXPORT_METHOD(crash)
{
    [SentrySDK crash];
}

RCT_EXPORT_METHOD(closeNativeSdk:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [SentrySDK close];
  resolve(@YES);
}

RCT_EXPORT_METHOD(disableNativeFramesTracking)
{
    // Do nothing on iOS, this bridge method only has an effect on android.
}

@end
