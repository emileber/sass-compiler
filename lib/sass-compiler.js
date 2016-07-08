module.exports = Compiler = (function() {

    var _debug          = {};
    var _projectPath    = '';
    var _directory;

    function SassCompiler() {

        var _this           = this;
        var currentView     = atom.workspace.getActiveTextEditor();

        var saveAction = function(e) {

            if (!currentView['sass-compiler-view-modified']) {
                return false;
            }

            currentView['sass-compiler-view-modified'] = false;

            if (_this.extension == 'scss') {
                _this.compile(_this.filePath);
            }
        };


        atom.workspace.onDidChangeActivePaneItem(function(item){

            currentView = item;

            // Verify if the currentView is define and is a texteditor
            if (typeof currentView == 'undefined' || atom.workspace.isTextEditor(item) === false) {
                return false;
            }

            _this.fileName  = item.getTitle();
            _this.extension = _this.fileName.split( '.' );
            _this.extension = _this.extension[_this.extension.length-1];
            _this.sc = {};

            _this.sc.directories = atom.project.getDirectories();
            _this.sc.currentFile = item.getPath();
            for (i = 0, len = _this.sc.directories.length; i < len; i++) {
                var directory = _this.sc.directories[i];
                    if (_this.sc.currentFile.indexOf(directory.path) > -1) {
                    _projectPath = directory.path;
                    _directory = directory;
                }
            }

            if ( typeof currentView['sass-compiler-activated'] == 'undefined' && _this.extension == 'scss' ) {

                _this.filePath = _this.sc.currentFile;

                currentView.onDidChange(function(){
                    currentView['sass-compiler-view-modified'] = atom.workspace.getActiveTextEditor().isModified();
                });

                currentView.onDidSave(saveAction);
                currentView['sass-compiler-activated'] = true;
            }

        });

        if ( typeof currentView == 'undefined' ) {
            return false;
        }

        this.fileName  = currentView.getTitle();
        this.extension = this.fileName.split( '.' );
        this.extension = this.extension[this.extension.length-1];
        this.sc = {};

        this.sc.directories = atom.project.getDirectories();
        this.sc.currentFile = currentView.getPath();
        for (i = 0, len = this.sc.directories.length; i < len; i++) {
            var directory = this.sc.directories[i];
                if (this.sc.currentFile.indexOf(directory.path) > -1) {
                _projectPath = directory.path;
                _directory = directory;
            }
        }

        if (this.extension == 'scss') {

            this.filePath = this.sc.currentFile;

            currentView.onDidChange(function(){
                currentView['sass-compiler-view-modified'] = atom.workspace.getActiveTextEditor().isModified();
            });

            currentView.onDidSave(saveAction);
            currentView['sass-compiler-activated'] = true;
        }
    }

    SassCompiler.prototype.compile = function( filePath ) {

        var configFile          = '.sasscompile';
        var exec                = require('child_process').exec;

        _directory.getFile(configFile).read().then(function(json) {

            var config = JSON.parse(json);

            // console.log(configFilePath);



            // Settings
            var sourceMap        = config.sourcemap;
            var inputFilePath    = config.input;
            var outputFilePath   = config.output;
            var outputStyle      = config.outputstyle;

            var inputFullPath   = _projectPath + inputFilePath;
            var outputFullPath  = _projectPath + outputFilePath;

            /* if (atom.config.get('sass-compiler.extractPath') ) {

                var path_array          = filePath.split( '\\' );
                var extracted_path      = '';
                var i                   = 0;
                var scss_catalog        = atom.config.get('sass-compiler.inputPathExtracted');

                // extracting path from editing file
                while( path_array[i] !== scss_catalog && path_array.indexOf( scss_catalog ) > -1 ) {

                    extracted_path += path_array[i] + '/';
                    i++;
                }

                var outputPathExtracted = atom.config.get('sass-compiler.outputPathExtracted');
                inputFullPath       = extracted_path + scss_catalog + '/' + fileName + '.scss';
                outputFullPath      = extracted_path + outputPathExtracted + '/' + fileName + '.css';
            } */

            var execString = 'node-sass --output-style ' + outputStyle + ' ' + inputFullPath + ' ' + outputFullPath;

            if ( sourceMap ) {
                // adds the source-map cli param only if set to true.
                // Prevents problem if libsass cli fails when the source-map param is set.
                execString += ' --source-map ' + _projectPath + sourceMap;
            }

            exec( execString, function (error, stdout, stderr) {

                if ( error !== null ) {
                    atom.notifications.addError( 'Error while compiling:',{
                        detail: error.message,
                        dismissable: true
                    });
                } else {
                    atom.notifications.addSuccess( 'Successfuly compiled' );
                }
            });

        });

    };

    return SassCompiler;
})();
