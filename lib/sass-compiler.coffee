Compiler = require './compiler'

module.exports = SassCompiler =

    config:
        inputFilePath:
            title: 'Input File Path'
            description: 'Where the scss file is exemple: "./frontend/app/css/main.scss"'
            type: 'string'
            default: ''

        outputFilePath:
            title: 'Output File Path'
            description: 'Where you want your css file is generated: "./frontend/app/css/main.css"'
            type: 'string'
            default: ''

        outputStyle:
            title: 'Output style'
            description: 'String to determine how the final CSS should be rendered. Its value should be one of nested or compressed.'
            type: 'string'
            default: 'compressed'
            enum: [ 'nested', 'compressed' ]

        successMsg:
            title: 'Enable/disable success message.'
            description: 'Turns on/off information about successful compiling.'
            type: 'boolean'
            default: true

        sourceMap:
            title: 'Generate source map.'
            description: 'Enable/disable auto-generated source map (generated.css.map).'
            type: 'boolean'
            default: false

    activate: (state) ->
        @compiler = new Compiler()
