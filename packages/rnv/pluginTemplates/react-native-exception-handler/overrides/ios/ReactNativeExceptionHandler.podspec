
Pod::Spec.new do |s|
  s.name         = "ReactNativeExceptionHandler"
  s.summary      = "A react native module that lets you to register a global error handler that can capture fatal/non fatal uncaught exceptions"
  s.version      = "2.3.0"
  s.description  = <<-DESC
                   A react native module that lets you to register a global error handler that can capture fatal/non fatal uncaught exceptions.
                   The module helps prevent abrupt crashing of RN Apps without a graceful message to the user.
                   DESC
  s.homepage     = "https://github.com/master-atul/react-native-exception-handler"
  s.license      = "MIT"
  s.author       = { "Atul R" => "atulanand94@gmail.com" }
  s.platforms     = { :ios => "7.0", :tvos => "9.2" }
  s.source       = { :git => "https://github.com/author/ReactNativeExceptionHandler.git", :tag => "master" }
  s.source_files  = "ReactNativeExceptionHandler/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"

end
