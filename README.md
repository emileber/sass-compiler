# Sass Compiler for ATOM editor

Sass Compiler based on node-sass library to compile scss file to css with Sourcemap.

## Config file (.sasscompile)

Just add a .sasscompile file in the root of your project. Here an example of the file :

```json
{
    "input" : "/example/of/your/scss/folder/yourfile.scss",
    "output" : "/example/of/your/css/folder/main.css",
    "outputstyle" : "nested",
    "sourcemap" : "/example/of/your/css/folder/main.css.map"
}
```

## Dependencies
* node-sass library https://github.com/sass/node-sass

## Plans
* Include `node-sass` in package dependencies to use apm node not local one.
