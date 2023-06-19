/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Ali Najafizadeh (github.com/alinz)
 * All rights reserved
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
 //AG

#import "RCTWebViewBridge.h"

#import <UIKit/UIKit.h>


#import <React/RCTAutoInsetsProtocol.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>

#import <React/UIView+React.h>
#import <objc/runtime.h>
#import <WebKit/WebKit.h>

//This is a very elegent way of defining multiline string in objective-c.
//source: http://stackoverflow.com/a/23387659/828487
#define NSStringMultiline(...) [[NSString alloc] initWithCString:#__VA_ARGS__ encoding:NSUTF8StringEncoding]

//we don'e need this one since it has been defined in RCTWebView.m
//NSString *const RCTJSNavigationScheme = @"react-js-navigation";
NSString *const RCTJSNavigationScheme = @"react-js-navigation";
NSString *const RCTWebViewBridgeSchema = @"__wvb__";

// runtime trick to remove UIWebview keyboard default toolbar
// see: http://stackoverflow.com/questions/19033292/ios-7-uiwebview-keyboard-issue/19042279#19042279
@interface _SwizzleHelper : NSObject @end
@implementation _SwizzleHelper
-(id)inputAccessoryView
{
  return nil;
}
@end

@interface RCTWebViewBridge () <WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler, RCTAutoInsetsProtocol>

@property (nonatomic, copy) RCTDirectEventBlock onLoadingStart;
@property (nonatomic, copy) RCTDirectEventBlock onLoadingFinish;
@property (nonatomic, copy) RCTDirectEventBlock onLoadingError;
@property (nonatomic, copy) RCTDirectEventBlock onShouldStartLoadWithRequest;
@property (nonatomic, copy) RCTDirectEventBlock onBridgeMessage;

@end

@implementation RCTWebViewBridge
{
  WKWebView *_webView;
  NSString *_injectedJavaScript;
  bool _shouldTrackLoadingStart;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if ((self = [super initWithFrame:frame])) {
    super.backgroundColor = [UIColor clearColor];
    _automaticallyAdjustContentInsets = YES;
    _contentInset = UIEdgeInsetsZero;
    _shouldTrackLoadingStart = NO;
    [self setupWebview];
    [self addSubview:_webView];
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (void)goForward
{
  [_webView goForward];
}

- (void)goBack
{
  [_webView goBack];
}

- (void)reload
{
  [_webView reload];
}

- (void)sendToBridge:(NSString *)message
{
  //we are warpping the send message in a function to make sure that if
  //WebView is not injected, we don't crash the app.
  NSString *format = NSStringMultiline(
    (function(){
      if (WebViewBridge && WebViewBridge.__push__) {
        WebViewBridge.__push__('%@');
      }
    }());
  );

  NSString *command = [NSString stringWithFormat: format, message];
  [_webView evaluateJavaScript:command completionHandler:^(id result, NSError * _Nullable error) {
    if (error) {
        NSLog(@"WKWebview sendToBridge evaluateJavaScript Error: %@", error);
    }
  }];
}

- (NSURL *)URL
{
  return _webView.URL;
}

- (void)setSource:(NSDictionary *)source
{
  if (![_source isEqualToDictionary:source]) {
    _source = [source copy];

    // Check for a static html source first
    NSString *html = [RCTConvert NSString:source[@"html"]];
    if (html) {
      NSURL *baseURL = [RCTConvert NSURL:source[@"baseUrl"]];
      [_webView loadHTMLString:html baseURL:baseURL];
      return;
    }

    NSURLRequest *request = [RCTConvert NSURLRequest:source];
    // Because of the way React works, as pages redirect, we actually end up
    // passing the redirect urls back here, so we ignore them if trying to load
    // the same url. We'll expose a call to 'reload' to allow a user to load
    // the existing page.
    if ([request.URL isEqual:_webView.URL]) {
      return;
    }
    if (!request.URL) {
      // Clear the webview
      [_webView loadHTMLString:@"" baseURL:nil];
      return;
    }
    [_webView loadRequest:request];
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _webView.frame = self.bounds;
}

- (void)setContentInset:(UIEdgeInsets)contentInset
{
  _contentInset = contentInset;
  [RCTView autoAdjustInsetsForView:self
                    withScrollView:_webView.scrollView
                      updateOffset:NO];
}

- (void)setBackgroundColor:(UIColor *)backgroundColor
{
  CGFloat alpha = CGColorGetAlpha(backgroundColor.CGColor);
  self.opaque = _webView.opaque = (alpha == 1.0);
  _webView.backgroundColor = backgroundColor;
}

- (UIColor *)backgroundColor
{
  return _webView.backgroundColor;
}

- (NSMutableDictionary<NSString *, id> *)baseEvent
{
  NSMutableDictionary<NSString *, id> *event = [[NSMutableDictionary alloc] initWithDictionary:@{
    @"url": _webView.URL.absoluteString ?: @"",
    @"loading" : @(_webView.loading),
    @"title": _webView.title,
    @"canGoBack": @(_webView.canGoBack),
    @"canGoForward" : @(_webView.canGoForward),
  }];

  return event;
}

- (void)refreshContentInset
{
  [RCTView autoAdjustInsetsForView:self
                    withScrollView:_webView.scrollView
                      updateOffset:YES];
}

-(void)setHideKeyboardAccessoryView:(BOOL)hideKeyboardAccessoryView
{
  if (!hideKeyboardAccessoryView) {
    return;
  }

  UIView* subview;
  for (UIView* view in _webView.scrollView.subviews) {
    if([[view.class description] hasPrefix:@"UIWeb"])
      subview = view;
  }

  if(subview == nil) return;

  NSString* name = [NSString stringWithFormat:@"%@_SwizzleHelper", subview.class.superclass];
  Class newClass = NSClassFromString(name);

  if(newClass == nil)
  {
    newClass = objc_allocateClassPair(subview.class, [name cStringUsingEncoding:NSASCIIStringEncoding], 0);
    if(!newClass) return;

    Method method = class_getInstanceMethod([_SwizzleHelper class], @selector(inputAccessoryView));
      class_addMethod(newClass, @selector(inputAccessoryView), method_getImplementation(method), method_getTypeEncoding(method));

    objc_registerClassPair(newClass);
  }

  object_setClass(subview, newClass);
}

#pragma mark - WebKit WebView Setup and JS Handler

-(void)setupWebview {
    WKWebViewConfiguration *theConfiguration = [[WKWebViewConfiguration alloc] init];
    WKUserContentController *controller = [[WKUserContentController alloc]init];
    [controller addScriptMessageHandler:self name:@"observe"];

    [theConfiguration setUserContentController:controller];
    theConfiguration.allowsInlineMediaPlayback = NO;

    _webView = [[WKWebView alloc] initWithFrame:self.bounds configuration:theConfiguration];
    _webView.UIDelegate = self;
    _webView.navigationDelegate = self;

    [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];
}

-(void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message{
  if ([message.body rangeOfString:RCTWebViewBridgeSchema].location == NSNotFound) {
    NSMutableDictionary<NSString *, id> *onBridgeMessageEvent = [[NSMutableDictionary alloc] initWithDictionary:@{
      @"messages": [self stringArrayJsonToArray: message.body]
    }];

    _onBridgeMessage(onBridgeMessageEvent);

    return;
  }

  [_webView evaluateJavaScript:@"WebViewBridge.__fetch__()" completionHandler:^(id result, NSError * _Nullable error) {
    if (!error) {
      NSMutableDictionary<NSString *, id> *onBridgeMessageEvent = [[NSMutableDictionary alloc] initWithDictionary:@{
        @"messages": [self stringArrayJsonToArray: result]
      }];

      _onBridgeMessage(onBridgeMessageEvent);
    }
  }];
}

#pragma mark - WebKit WebView Delegate methods

- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation
{
  _shouldTrackLoadingStart = YES;
}

-(void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler{
  if (_onLoadingStart && _shouldTrackLoadingStart) {
    _shouldTrackLoadingStart = NO;
    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
    [event addEntriesFromDictionary: @{
      @"url": (navigationAction.request.URL).absoluteString,
      @"navigationType": @(navigationAction.navigationType)
    }];
    _onLoadingStart(event);
  }

  if (_onShouldStartLoadWithRequest) {
    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
    [event addEntriesFromDictionary: @{
      @"url": (navigationAction.request.URL).absoluteString,
      @"navigationType": @(navigationAction.navigationType)
    }];

    if (![self.delegate webView:self shouldStartLoadForRequest:event withCallback:_onShouldStartLoadWithRequest]) {
      decisionHandler(WKNavigationActionPolicyCancel);
    }else{
      decisionHandler(WKNavigationActionPolicyAllow);
    }
  }
  decisionHandler(WKNavigationActionPolicyAllow);
}

-(void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error{
  if (_onLoadingError) {
    if ([error.domain isEqualToString:NSURLErrorDomain] && error.code == NSURLErrorCancelled) {
      // NSURLErrorCancelled is reported when a page has a redirect OR if you load
      // a new URL in the WebView before the previous one came back. We can just
      // ignore these since they aren't real errors.
      // http://stackoverflow.com/questions/1024748/how-do-i-fix-nsurlerrordomain-error-999-in-iphone-3-0-os
      return;
    }

    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
    [event addEntriesFromDictionary:@{
      @"domain": error.domain,
      @"code": @(error.code),
      @"description": error.localizedDescription,
    }];
    _onLoadingError(event);
  }
}

-(void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
  NSString *webViewBridgeScriptContent = [self webViewBridgeScript];
  [webView evaluateJavaScript:webViewBridgeScriptContent completionHandler:^(id webviewScriptResult, NSError * _Nullable webviewScriptError) {
    if (webviewScriptError) {
      NSLog(@"WKWebview sendToBridge evaluateJavaScript Error: %@", webviewScriptError);
      return;
    }

    if (_injectedJavaScript != nil) {
      [webView evaluateJavaScript:_injectedJavaScript completionHandler:^(id result, NSError * _Nullable error) {
        NSString *jsEvaluationValue = (NSString *) result;
        NSMutableDictionary<NSString *, id> *event = [self baseEvent];
        event[@"jsEvaluationValue"] = jsEvaluationValue;
        if (_onLoadingFinish) {
          _onLoadingFinish(event);
        }
      }];
    } else if (_onLoadingFinish) {
      _onLoadingFinish([self baseEvent]);
    }
  }];
}

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures
{

  if (!navigationAction.targetFrame.isMainFrame) {
    [webView loadRequest:navigationAction.request];
  }

  return nil;
}

#pragma mark - WebviewBridge helpers

- (NSArray*)stringArrayJsonToArray:(NSString *)message
{
  return [NSJSONSerialization JSONObjectWithData:[message dataUsingEncoding:NSUTF8StringEncoding]
                                         options:NSJSONReadingAllowFragments
                                           error:nil];
}

//since there is no easy way to load the static lib resource in ios,
//we are loading the script from this method.
- (NSString *)webViewBridgeScript {
  // NSBundle *bundle = [NSBundle mainBundle];
  // NSString *webViewBridgeScriptFile = [bundle pathForResource:@"webviewbridge"
  //                                                      ofType:@"js"];
  // NSString *webViewBridgeScriptContent = [NSString stringWithContentsOfFile:webViewBridgeScriptFile
  //                                                                  encoding:NSUTF8StringEncoding
  //                                                                     error:nil];

  return NSStringMultiline(
    (function (window) {
      //Make sure that if WebViewBridge already in scope we don't override it.
      if (window.WebViewBridge) {
        return;
      }

      var RNWBSchema = 'wvb';
      var sendQueue = [];
      var receiveQueue = [];
      var doc = window.document;
      var customEvent = doc.createEvent('Event');

      function wkWebViewBridgeAvailable() {
        return (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.observe &&
          window.webkit.messageHandlers.observe.postMessage
        );
      }

      function wkWebViewSend(event) {
        if (!wkWebViewBridgeAvailable()) {
          return;
        }
        try {
          window.webkit.messageHandlers.observe.postMessage(event);
        } catch (e) {
          console.error('wkWebViewSend error', e.message);
          if (window.WebViewBridge.onError) {
            window.WebViewBridge.onError(e);
          }
        }
      }

      function callFunc(func, message) {
        if ('function' === typeof func) {
          func(message);
        }
      }

      function signalNative() {
        if (wkWebViewBridgeAvailable()) {
          var event = window.WebViewBridge.__fetch__();
          wkWebViewSend(event);
        } else { // iOS UIWebview
          window.location = RNWBSchema + '://message' + new Date().getTime();
        }
      }

      //I made the private function ugly signiture so user doesn't called them accidently.
      //if you do, then I have nothing to say. :(
      var WebViewBridge = {
        //this function will be called by native side to push a new message
        //to webview.
        __push__: function (message) {
          receiveQueue.push(message);
          //reason I need this setTmeout is to return this function as fast as
          //possible to release the native side thread.
          setTimeout(function () {
            var message = receiveQueue.pop();
            callFunc(WebViewBridge.onMessage, message);
          }, 15); //this magic number is just a random small value. I don't like 0.
        },
        __fetch__: function () {
          //since our sendQueue array only contains string, and our connection to native
          //can only accept string, we need to convert array of strings into single string.
          var messages = JSON.stringify(sendQueue);

          //we make sure that sendQueue is resets
          sendQueue = [];

          //return the messages back to native side.
          return messages;
        },
        //make sure message is string. because only string can be sent to native,
        //if you don't pass it as string, onError function will be called.
        send: function (message) {
          if ('string' !== typeof message) {
            callFunc(WebViewBridge.onError, "message is type '" + typeof message + "', and it needs to be string");
            return;
          }

          //we queue the messages to make sure that native can collects all of them in one shot.
          sendQueue.push(message);
          //signal the objective-c that there is a message in the queue
          signalNative();
        },
        onMessage: null,
        onError: null
      };

      window.WebViewBridge = WebViewBridge;

      //dispatch event
      customEvent.initEvent('WebViewBridge', true, true);
      doc.dispatchEvent(customEvent);
    })(this);
  );
}

@end
