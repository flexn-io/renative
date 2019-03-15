//
//  AppDelegate.swift
//  React Native Vanilla
//
//  Created by Pavel Jacko on 03/08/2018.
//  Copyright © 2018 pavjacko. All rights reserved.
//

import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    let moduleName = "App"

    var uiView: RCTRootView!
    #if DEBUG
    var bundleUrl = URL(string: "http://localhost:8081/{{ENTRY_FILE}}.bundle?platform=ios")
    #else
    let bundleUrl = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "{{ENTRY_FILE}}", fallbackResource: nil)
    #endif

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {




        #if DEBUG
        var myDict: NSDictionary?
        if let path = Bundle.main.path(forResource: "Debug-Info", ofType: "plist") {
            myDict = NSDictionary(contentsOfFile: path)
        }
        if (myDict != nil) {
            let serverIp = myDict!["serverIP"] as! String
            if(serverIp != "bundle") {
                bundleUrl = URL(string: "http://" + serverIp + ":8081/{{ENTRY_FILE}}.bundle?platform=ios")
            } else {
                bundleUrl = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "{{ENTRY_FILE}}", fallbackResource: nil)
            }
        }
        #endif

        self.window = UIWindow(frame: UIScreen.main.bounds)
        let vc = UIViewController()
        let v = RCTRootView(
            bundleURL: bundleUrl,
            moduleName: moduleName,
            initialProperties: nil,
            launchOptions: launchOptions)
        vc.view = v
        v?.frame = vc.view.bounds
        self.window?.rootViewController = vc
        self.window?.makeKeyAndVisible()

        return true
    }
}
