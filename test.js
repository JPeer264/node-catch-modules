var mocha = require('mocha'),
    chai = require('chai'),
    expect = chai.expect,
    _ = require('lodash'),
    findModules = require('./');

// todo test catch global modules

describe('find some modules by name', function () {
    it('should find 1 module by name', function (done) {
        expect(findModules.byNameSync('test').length).to.equal(1);

        findModules.byName('test', function(err, data) {
            expect(data.length).to.equal(1);
            done();
        });
    });

    it('should find module "test" by name', function (done) {
        expect((findModules.byNameSync('test'))[0].name).to.equal('catch-modules-test');
        expect((findModules.byNameSync('test'))[0].keyword).to.equal('test');

        // todo async version
        done();
    });
});

describe('find some modules by dependency', function () {
    it('should find 1 module by dependency', function (done) {
        expect(findModules.byDependencySync('mocha').length).to.equal(1);

        findModules.byDependency('mocha', function(err, data) {
            expect(data.length).to.equal(1);
            done();
        });
    });

    it('should find module in dependency of catch-modules-test', function (done) {
        var listOfModules = findModules.byDependencySync('mocha');

        _.forEach(listOfModules, function(module, index) {
            if (module.module === 'catch-modules-test') {
                expect(module.name).to.equal('mocha');
                expect(module.keyword).to.equal('mocha');
            }
        });

        findModules.byDependency('mocha', function (err, data) {
            _.forEach(listOfModules, function(module, index) {
                if (module.module === 'catch-modules-test') {
                    expect(module.name).to.equal('mocha');
                    expect(module.keyword).to.equal('mocha');

                    done();
                }
            });
        });
    });
})
