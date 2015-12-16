'use strict';
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

// todo get list of npm packages by name
// todo get list of npm packages by packages.json depenency name
// todo either global or local -> boolean, true = global

// todo return "name", "path"

exports.byName = function (isGlobal, keyword, cb) {
    var err = undefined;
    var pathToGlobalModules = path.join(process.env.APPDATA, 'npm/node_modules');
    var pathToLocalModules = path.join(process.cwd(), 'node_modules');
    var pathname = pathToLocalModules;
    var list = [];

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

        // filter
        _.forEach(data, function(value, index) {
            if (value.indexOf(keyword) < 0) return;

            list.push({
                name: value,
                path: path.join(pathname, value)
            });
        });

        return cb(err, list);
    });
}


/**
 * todo search by dependencies in packagejson
 */
exports.byDependency = function (isGlobal, keyword) {

}