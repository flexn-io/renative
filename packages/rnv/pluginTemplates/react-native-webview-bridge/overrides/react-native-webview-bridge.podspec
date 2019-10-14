require 'json'
version = JSON.parse(File.read('package.json'))["version"]

Pod::Spec.new do |s|

  s.name            = "react-native-webview-bridge"
  s.version         = version
  s.homepage        = "https://github.com/alinz/react-native-webview-bridge"
  s.summary         = "A webview bridge for react-native"
  s.license         = "MIT"
  s.author          = { "aurimas535" => "aurimas.mickys@gmail.com" }
  s.ios.deployment_target = '7.0'
  s.tvos.deployment_target = '9.0'
  s.source          = { :git => "https://github.com/aurimas535/react-native-webview-bridge", :tag => "#{s.version}" }
  s.source_files    = 'ios/*.{h,m}'
  s.preserve_paths  = "**/*.js"
  s.frameworks = 'UIKit', 'QuartzCore', 'Foundation'

  s.dependency 'React'
end
