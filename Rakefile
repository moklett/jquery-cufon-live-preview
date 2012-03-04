
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

begin
  require 'closure-compiler'
  task :compress do
    compressed = Closure::Compiler.new.compile(File.open('jquery-cufon-live-preview.js', 'r'))
    File.open("jquery-cufon-live-preview.min.js", 'w') do |outfile|
      outfile.write(compressed)
    end
  end
rescue LoadError
  rask :compress do
    abort "Closure::Compiler is not available.  In order to compress the javascript, please: gem install closure-compiler"
  end
end
