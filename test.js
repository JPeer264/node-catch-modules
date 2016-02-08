var mocha = require('mocha'),
    chai = require('chai'),
    expect = chai.expect,
    _ = require('lodash'),
    findModules = require('./');

var testModule = 'catch-modules-test';
var testDependency = 'mocha';
var searchHint = 'test';

// todo test catch global modules

describe('+byNameSync', function () {
    it('should find 1 module', function (done) {
        expect(findModules.byNameSync(searchHint).length).to.equal(1);

        done();
    });

    it('should have correct values in object', function (done) {
        expect((findModules.byNameSync(searchHint))[0].name).to.equal(testModule);
        expect((findModules.byNameSync(searchHint))[0].keyword).to.equal(searchHint);

        // todo async version
        done();
    });

    it('should find a global module', function (done) {
        expect(findModules.byNameSync(true, testDependency).length).to.equal(1);

        done();
    });

    it('should return an empty array if nothing is found', function (done) {
        var fakeModule = findModules.byNameSync('you-can-never-find-me');

        expect(fakeModule).to.be.an('array');
        expect(fakeModule).to.be.empty;

        done();
    });
});

describe('+ byName', function () {
    // todo add fail if 'err'

    // byName
    it('should find 1 module', function (done) {
        findModules.byName(searchHint, function(err, data) {
            expect(data.length).to.equal(1);
            done();
        });
    });

    it('should have correct values in object', function (done) {
        findModules.byName(searchHint, function (err, data) {
            expect(data[0].name).to.equal(testModule);
            expect(data[0].keyword).to.equal(searchHint);
        
            done();
        });
    });

    it('should find a global module', function (done) {
        findModules.byName(true, testDependency, function (err, data) {
            expect(data).to.have.length.of.at.least(1);

            done();
        });
    });
});

describe('+byDependencySync', function () {
    it('should find 1 module', function (done) {
        expect(findModules.byDependencySync(testDependency).length).to.equal(1);

        done();
    });

    it('should have correct values in object', function (done) {
        var listOfModules = findModules.byDependencySync(testDependency);

        _.forEach(listOfModules, function(module, index) {
            if (module.module === testModule) {
                expect(module.name).to.equal(testDependency);
                expect(module.keyword).to.equal(testDependency);
            }
        });

        done();
    });

    it('should find a global module', function (done) {
        expect(findModules.byDependencySync(true, testDependency).length).to.equal(1);

        done();
    });
});

describe('+ byDependency', function () {
    it('should find 1 Module', function (done) {
        findModules.byDependency(testDependency, function(err, data) {
            expect(data.length).to.equal(1);
            done();
        });
    });

    it('should have correct values in object', function (done) {
        var listOfModules = findModules.byDependencySync(testDependency);

        findModules.byDependency(testDependency, function (err, data) {
            _.forEach(listOfModules, function(module, index) {
                if (module.module === testModule) {
                    expect(module.name).to.equal(testDependency);
                    expect(module.keyword).to.equal(testDependency);

                    done();
                }
            });
        });
    });
});
