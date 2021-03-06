'use strict';
// modules
var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    _ = require('lodash'),
    json = require('json-extra'),
    execSync = require('child_process').execSync,
    async = require('async');

var pathToGlobalModules = os.platform() === 'win32' ? path.join(process.env.APPDATA, 'npm/node_modules') : execSync('npm root -g').toString().replace(/\s$/,'');
var pathToLocalModules = path.join(process.cwd(), 'node_modules');
var dependencies = [
    'devDependencies',
    'dependencies',
    'peerDependencies'
];

/**
 * catch modules by name
 *
 * @param isGlobal {boolean}  global modules?
 * @param keyword  {String}   by what should it be filtered
 * @param cb       {Function} callback
 *
 * @return cb      {Function} return an array with objects in it - found modules
 */
exports.byName = function (isGlobal, keyword, cb) {
    var pathname = pathToLocalModules;
    var err = undefined;

    if (typeof keyword !== 'string') {
        cb = keyword;
        keyword = isGlobal;
        isGlobal = false;
    }

    if (isGlobal) {
        pathname = pathToGlobalModules;
    }

    fs.readdir(pathname, function(err, data) {
        if (err) return cb(err);

        // directly return err & filtered array
        return cb(err, filter(data, keyword, pathname));
    });
}


/**
 * catch modules by name - sync version
 *
 * @param isGlobal {boolean} global modules?
 * @param keyword  {String} by what should it be filtered
 *
 * @return {Array} return an array with objects in it - found modules
 */
exports.byNameSync = function (isGlobal, keyword) {
    var pathname = pathToLocalModules;
    var list = [];
    var result = [];

    if (typeof isGlobal !== 'boolean') {
        keyword = isGlobal;
        isGlobal = false;
    }

    pathname = isGlobal ? pathToGlobalModules : pathname;

    return filter(fs.readdirSync(pathname), keyword, pathname);
}

/**
 * search dependencies by name in node_modules
 *
 * @param isGlobal {boolean} global modules?
 * @param keyword  {String} by what should it be filtered
 * @param cb       {Function} callback
 *
 * @return cb
 *
 * todo add options
 * todo add option to look in dev, peer or normal dependencies
 * todo add option to have a custom path
 */
exports.byDependency = function (isGlobal, keyword, cb) {
    var pathname = pathToLocalModules;
    var result = [];

    if (typeof keyword !== 'string') {
        cb = keyword;
        keyword = isGlobal;
        isGlobal = false;
    }

    pathname = isGlobal ? pathToGlobalModules : pathname;

    fs.readdir(pathname, function(err, list) {
        var functionArray = [];
        if (err) return cb(err);
        // loop through node_modules folder, check if there is a package.json
        // return null if no package.json is found
        _.forEach(list, function(value, key) {
            
            
            functionArray.push(
                function(callback) {
                    var packageResult = [];
                    var subpathname = path.join(pathname, value);

                    if (!fs.lstatSync(subpathname).isDirectory()) {
                        return callback(null, []);
                    }

                    fs.readdir(subpathname, function(err, filesInDir) {

                        if (filesInDir === undefined) {
                            filesInDir = [];
                        }

                        var files = filesInDir.filter(function(value) {
                            return !value.indexOf('package.json');
                        });

                        if (filesInDir.length === 0) {
                            files = null;
                        }
                        // console.log('dir', value);
                        // console.log('files', filesInDir);
                        // read package.json
                        if (value.charAt(0) !== '.') {
                            json.readToObj(path.join(subpathname, 'package.json'), function(data, err) {
                                if (err) return callback(null, []);
                                if (data.dependencies) {
                                    packageResult.push(filterDependencies(data.dependencies, keyword, subpathname));

                                    callback(null, _.flatten(packageResult));
                                } else {
                                    callback(null, []);
                                }
                            });
                        } else {
                            // e.g. .bin could not be read -> give empty array
                            callback(null, []);
                        }
                    });
                }
            );
        });

        // loop through fs.readdir array
        async.parallel(functionArray, function(err, data) {
            if (err) return;
            return cb(err, _.flattenDeep(data));
        });
    });
}

/**
 * search dependencies by name in node_modules - sync
 *
 * @param isGlobal {boolean} global modules?
 * @param keyword  {String} by what should it be filtered
 *
 * @return result {Object}
 *
 * todo add options
 * todo add option to look in dev, peer or normal dependencies
 * todo add option to have a custom path
 */
exports.byDependencySync = function (isGlobal, keyword, cb) {
    var pathname = pathToLocalModules;
    var result = [];
    var dir;
    var subpathname;

    if (typeof keyword !== 'string') {
        cb = keyword;
        keyword = isGlobal;
        isGlobal = false;
    }

    pathname = isGlobal ? pathToGlobalModules : pathname;

    dir = fs.readdirSync(pathname);
    _.forEach(dir, function(value, key) {
        subpathname = path.join(pathname, value);

        if (value.charAt(0) !== '.' && fs.lstatSync(subpathname).isDirectory()) {
            var data = json.readToObjSync(path.join(subpathname, 'package.json'));

            if (data.dependencies) {
                result.push(filterDependencies(data.dependencies, keyword, subpathname));
            }
        }
    });

    return _.flatten(result);
}

/**
 * filter by keyword
 *
 * @param array    {Object} which array should be filtered
 * @param keyword  {String} by what should it be filtered
 * @param pathname {String} where is node_modules
 *
 * @return result  {Array}  array with objects in it - filtered by name, keyword and path
 */
function filter(array, keyword, pathname) {
    var result = [];

    _.forEach(array, function(value, index) {
        if (value.indexOf(keyword) < 0) return;

        result.push({
            name: value,
            keyword: keyword,
            path: path.join(pathname, value)
        });
    });
    return result;
}

/**
 * filter by keyword
 *
 * @param array    {Object} which array should be filtered
 * @param keyword  {String} by what should it be filtered
 * @param pathname {String} where is node_modules
 *
 * @return result  {Array}  array with objects in it - filtered by name, module, keyword, path and rootpath
 */
function filterDependencies(array, keyword, pathname, dependencyType) {
    var result = [];

    _.forEach(array, function(value, key) {
        if (key.indexOf(keyword) < 0) return;

        result.push({
            name: key,
            module: path.basename(pathname),
            keyword: keyword,
            path: path.join(pathname, 'node_modules', key),
            rootpath: path.join(pathname)
        });
    });

    return result;
}
