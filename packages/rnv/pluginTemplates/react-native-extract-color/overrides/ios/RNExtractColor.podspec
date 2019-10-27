Pod::Spec.new do |s|
  s.name         = "RNExtractColor"
  s.version      = "1.0.1"
  s.summary      = "RNExtractColor"
  s.description  = "bla"
  s.homepage     = "bla"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author             = { "author" => "izzetao@gmail.com" }
  s.platforms    = { :ios => "7.0", :tvos => "9.0" }
  s.source       = { :git => "https://github.com/zzetao/react-native-extract-color.git", :tag => "master" }
  s.source_files  = "**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end