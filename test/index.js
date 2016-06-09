var assert = require('chai').assert;
var should = require('chai').should();
var Sequelize = require('sequelize');
var db = new Sequelize('postgresql://test1:test1@localhost/test1');
var unicActionModel = require('../index.js');
var UnicAction = db.define('unic', unicActionModel.model, unicActionModel.methods);


describe("Test unic action >>", function(){
   it('initialize the DB', function () {
      return UnicAction.drop().then(function(){
        return UnicAction.sync();
      });
   })
   it('create a valid action and redeem an action', function () {
     return UnicAction.createHash({action:"validateEmail", duration:1000*60*10}).then(function(result){
       should.exist(result);
       result.should.be.an('object');
       assert.equal(result.isUsed, false);
      return UnicAction.findHash(result.hash);
    }).then(function(result){
      should.exist(result);
      return result.hashIsUsed();
    }).then(function(result){
      should.exist(result);
      result.should.be.an('object');
      assert.equal(result.isUsed, true);
    }).catch(function(error){
       should.not.exist(error);
     });
   })
   it('create an empty/wrong action', function () {
     return UnicAction.createHash({duration:1000*60*10}).then(function(result){
       should.not.exist(result);
     }).catch(function(error){
       should.exist(error);
     });
   })

})