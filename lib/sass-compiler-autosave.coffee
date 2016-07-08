Compiler = require './compiler'

module.exports = SassCompiler =

    config:
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
