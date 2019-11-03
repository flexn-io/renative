require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|

  s.name           = 'Picker'
  s.version        = package['version'].gsub(/v|-beta/, '')
  s.summary        = package['description']
  s.author         = package['author']
  s.license        = package['license']
  s.homepage       = package['homepage']
  s.source         = { :git => 'https://github.com/beefe/react-native-picker.git', :tag => "v#{s.version}"}
  s.platforms       = { :ios => "7.0", :tvos => "9.2" }
  s.preserve_paths = '*.js'

  s.subspec 'Core' do |ss|
    ss.dependency 'React'
    ss.source_files = 'ios/RCTBEEPickerManager/*.{h,m}'
    ss.public_header_files = ['ios/RCTBEEPickerManager/*.h']
  end

end
