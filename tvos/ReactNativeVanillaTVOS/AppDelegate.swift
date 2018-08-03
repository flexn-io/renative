//
//  AppDelegate.swift
//  ReactNativeVanilla
//
//  Created by Pavel Jacko on 03/08/2018.
//  Copyright © 2018 pavjacko. All rights reserved.
//

import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        self.window = UIWindow(frame: UIScreen.main.bounds)
        let vc = UIViewController()
        let v = RCTRootView(
            bundleURL: URL(string: "http://localhost:8081/index.ios.bundle?platform=ios"),
            moduleName: "App",
            initialProperties: nil,
            launchOptions: launchOptions)
        vc.view = v
        v?.frame = vc.view.bounds
        self.window?.rootViewController = vc
        self.window?.makeKeyAndVisible()
        return true
    }
}

