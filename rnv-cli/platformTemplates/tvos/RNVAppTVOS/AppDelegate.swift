//
//  AppDelegate.swift
//  ReNative
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
    let bundleUrl = {{BUNDLE}}

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

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

        return true
    }
}
