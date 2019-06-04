//
//  AppDelegate.swift
//  RNVApp
//
//  Created by Pavel Jacko on 02/01/2019.
//
//

import UIKit
import CoreData
import React
import UserNotifications
{{APPDELEGATE_IMPORTS}}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    var window: UIWindow?
    let moduleName = "App"

    var uiView: RCTRootView!
    let bundleUrl = {{BUNDLE}}

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        let userAgent = UIWebView().stringByEvaluatingJavaScript(from: "navigator.userAgent")! + " ultrasonic-native,webkit," + (Bundle.main.object(forInfoDictionaryKey: "CFBundleIdentifier") as! String) + ",v" + (Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as! String)
        UserDefaults.standard.register(defaults: ["UserAgent": userAgent])

        self.window = UIWindow(frame: UIScreen.main.bounds)
        let vc = UIViewController()
        let v = RCTRootView(
            bundleURL: bundleUrl,
            moduleName: moduleName,
            initialProperties: nil,
            launchOptions: launchOptions)
        vc.view = v
        {{BACKGROUND_COLOR}}
        v?.frame = vc.view.bounds
        self.window?.rootViewController = vc
        self.window?.makeKeyAndVisible()
        UNUserNotificationCenter.current().delegate = self

        return true
    }

    {{APPDELEGATE_METHODS}}
}
