require 'json'
require './firebase_json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
firebase_sdk_version = package['sdkVersions']['ios']['firebase'] || '~> 6.25.0'

Pod::Spec.new do |s|
  s.name                = "RNFBApp"
  s.version             = package["version"]
  s.description         = package["description"]
  s.summary             = <<-DESC
                            A well tested feature rich Firebase implementation for React Native, supporting iOS & Android.
                          DESC
  s.homepage            = "http://invertase.io/oss/react-native-firebase"
  s.license             = package['license']
  s.authors             = "Invertase Limited"
  s.source              = { :git => "https://github.com/invertase/react-native-firebase.git", :tag => "v#{s.version}" }
  s.social_media_url    = 'http://twitter.com/invertaseio'
  s.platforms           = { :ios => "10.0", :tvos => "9.2" }
  s.source_files        = "ios/**/*.{h,m}"

  # React Native dependencies
  s.dependency          'React'

  # Firebase dependencies
  s.dependency          'Firebase/CoreOnly', firebase_sdk_version
  s.subspec 'Crashlytics' do |cs|
    cs.dependency 'Fabric'
    cs.dependency 'Crashlytics'
  end

  s.static_framework = true
end
