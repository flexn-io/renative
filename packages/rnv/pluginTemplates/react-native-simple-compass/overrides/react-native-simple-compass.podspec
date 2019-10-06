require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.summary      = package["description"]
  s.author       = package["author"]
  s.homepage     = 'https://github.com/AppGyver'
  s.license      = package["license"]
  s.platform     = :ios, "8.4"
  s.source       = { :git => "https://github.com/AppGyver/react-native-simple-compass", :tag => "#{s.version}" }
  s.source_files  = "ios/*.{h,m}"
  s.dependency "React"
end