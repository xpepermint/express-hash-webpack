# [express](https://github.com/strongloop/express)-[hash](https://github.com/xpepermint/hash-webpack-plugin)-[webpack](http://webpack.github.io)

> Webpack asset pipeline helpers for ExpressJS.

This middleware adds asset helpers for dealing with [Webpack](http://webpack.github.io) assets when using the [hash-webpack-plugin](https://github.com/xpepermint/hash-webpack-plugin) plugin.

## Setup

```js
npm instal --save express-hash-webpack
```

## Example

```js
// server.js (Express app)
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(assets({
  hashPath: './build',
  hashFileName: 'hash.txt',
  hashTemplate: '.[value]',
  assetTemplate: function(req, res) { // example of dynamic path
    var locale = 'en.';
    return 'http://localhost:8080[path]' + locale + '[name][hash][ext]';
  },
  cache: false
}));
```

```jade
// layout.jade (dynamic view)
doctype html
html(lang="en")
  head
    title= pageTitle
  body
    h3 Assets available at #{assetPath('index.js')}.
    block body
    script(type='text/javascript', src=assetPath('index.js'))
```

## Config

### hashPath: String | Function

> Path to the assets hash file directory.

### hashFileName: String | Function

> Name of the hash file name.

### hashTemplate: String | Function

> Hash value template.

### assetTemplate: String | Function

> Asset full path template.

### cache: Boolean

> Cache results.
