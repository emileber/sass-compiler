module.exports = Compiler = (function() {

    var _debug          = {};

    function Compiler() {

        var _this           = this;
        var currentView     = atom.workspace.getActiveTextEditor();
        this.project_path   = atom.project.getPaths()[0];


        var saveAction = function( e ){

            /* if ( !currentView['sass-compiler-view-modified'] ) {
                console.log(_this.currentView);
                return false;
            } */

            currentView['sass-compiler-view-modified'] = false;

            if ( _this.extension == 'scss' ) {


                _this.compile( _this.filePath );
            }
        };

        atom.workspace.onDidChangeActivePaneItem(function( item ){

            currentView = item;

            // Incase if we will not get a current view
            if ( typeof currentView == 'undefined' ) {

                return false;
            }

            _this.fileName = currentView.getTitle();
            _this.extension = _this.fileName.split( '.' );
            _this.extension = _this.extension[_this.extension.length-1];

            if ( typeof item['sass-compiler-activated'] == 'undefined' && _this.extension == 'scss' ) {

                _this.filePath = currentView.getPath();

                currentView.onDidSave( saveAction );
                currentView['sass-compiler-activated'] = true;
            }
        });

        if ( typeof currentView == 'undefined' ) {

            return false;
        }

        this.fileName   = currentView.getTitle();
        this.extension  = this.fileName.split( '.' );
        this.extension  = this.extension[this.extension.length-1];

        if ( this.extension == 'scss' ) {

            this.filePath   = currentView.getPath();

            currentView.onDidChange(function(){
                currentView['sass-compiler-view-modified'] = atom.workspace.getActiveTextEditor().isModified();
            });
            currentView.onDidSave( saveAction );
            currentView['sass-compiler-activated'] = true;
        }
    }

    Compiler.prototype.compile = function( filePath ) {

        // @TODO after  Module did not self-register problem will be solved.
        //   var sass = require('node-sass');
        var exec            = require('child_process').exec;

        // Settings
        var sourceMap        = atom.config.get('sass-compiler.sourceMap');
        var inputFilePath    = atom.config.get('sass-compiler.inputFilePath');
        var outputFilePath   = atom.config.get('sass-compiler.outputFilePath');
        var outputStyle     = atom.config.get('sass-compiler.outputStyle'); 

        var inputFullPath   = this.project_path + '/' + inputFilePath;
        var outputFullPath  = this.project_path + '/' + outputFilePath;

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
        console.log(execString);

        if ( sourceMap ) {
            // adds the source-map cli param only if set to true.
            // Prevents problem if libsass cli fails when the source-map param is set.
            execString += ' --source-map ' + sourceMap;
        }

        exec( execString, function (error, stdout, stderr) {

            if ( error !== null ) {

                atom.notifications.addError( 'Error while compiling:',{
                    detail: error.message,
                    dismissable: true
                });
            } else {

                if ( atom.config.get('sass-compiler.successMsg') ) {
                    atom.notifications.addSuccess( 'Successfuly compiled' );
                }
            }
        });
    };

    return Compiler;
})();
