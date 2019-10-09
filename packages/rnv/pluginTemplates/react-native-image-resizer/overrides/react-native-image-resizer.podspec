require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name     = "react-native-image-resizer"
  s.version  = package['version']
  s.summary  = package['description']
  s.homepage = "https://github.com/bamlab/react-native-image-resizer"
  s.license  = package['license']
  s.author   = package['author']
  s.source   = { :git => "https://github.com/bamlab/react-native-image-resizer.git", :tag => "v#{s.version}" }

  s.platforms = { :ios => "8.0", :tvos => "9.2" }

  s.preserve_paths = 'README.md', 'LICENSE', 'package.json', 'index.js'
  s.source_files   = "ios/RCTImageResizer/*.{h,m}"

  s.dependency 'React'
end
