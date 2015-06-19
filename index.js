var fs = require('fs');
var path = require('path');

module.exports = function(options) {

  var hashPath = options.hashPath || './';
  var hashFileName = options.hashFileName || 'hash.txt';
  var hashTemplate = options.hashTemplate || '.[value]'; // template fror [hash] in assetTemplate
  var assetTemplate = options.assetTemplate || '[path][name][hash][ext]';

  var cachedHashValues = {}; // per dynamicPath
  var cachedAssetPaths = {}; // per assetPath

  var cacheEnabled = options.cache || process.NODE_ENV === 'production'; // when true, helpers will return cached data

  return function(req, res, next) {

    var dynamicHashPath = typeof(hashPath) == 'function'
      ? hashPath.call(null, req, res)
      : hashPath
    var dynamicHashFileName = typeof(hashFileName) == 'function'
      ? hashFileName.call(null, req, res)
      : hashFileName
    var dynamicPath = path.join(dynamicHashPath, dynamicHashFileName);

    var dynamicHashTemplate = typeof(hashTemplate) == 'function'
      ? hashTemplate.call(null, req, res)
      : hashTemplate
    var dynamicAssetTemplate = typeof(assetTemplate) == 'function'
      ? assetTemplate.call(null, req, res)
      : assetTemplate

    /*
    * Returns current assets hash value.
    *
    * @return {string}
    */
    res.locals.assetHash = function() {
      var hashValue;
      try {
        hashValue = fs.readFileSync(dynamicPath);
      } catch(e) {
        hashValue = '';
      }

      return cacheEnabled && cachedHashValues[dynamicPath]
        ? cachedHashValues[dynamicPath]
        : cachedHashValues[dynamicPath] = hashValue;
    };

    /*
    * Converts and returns passed public asset path into precompiled format.
    *
    * @param assetPath {string}
    * @return {string}
    */
    res.locals.assetPath = function(assetPath) {
      return cacheEnabled && cachedAssetPaths[assetPath]
        ? cachedAssetPaths[assetPath]
        : cachedAssetPaths[assetPath] = buildAssetPath(assetPath);

      function buildAssetPath(assetPath) {
        var hashValue = res.locals.assetHash();
        var hashString = hashValue
          ? dynamicHashTemplate.replace('[value]', hashValue)
          : '';
        var assetData = path.parse(assetPath);
        return dynamicAssetTemplate
          .replace('[path]', assetData.dir + '/')
          .replace('[name]', assetData.name)
          .replace('[hash]', hashString)
          .replace('[ext]', assetData.ext
        );
      }
    };

    next();
  };
};
