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
   });
   it('create a valid action and redeem an action', function () {
     return UnicAction.create({action:"validateEmail", duration:1000*60*10, limitDateValidity:null}).then(function(result){
       should.exist(result, 'create unic action ok');
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
       console.log("error : ", error);
       should.not.exist(error);
     });
   });
   it('create a valid action and redeem an action with validate', function () {
     return UnicAction.create({action:"validateEmail", duration:1000*60*10, limitDateValidity:null}).then(function(result){
       should.exist(result, 'create unic action ok');
       result.should.be.an('object');
       assert.equal(result.isUsed, false);
      return UnicAction.validateHash(result.hash);
    }).then(function(result){
      should.exist(result);
      assert.equal(result, true);
      return result;
    }).catch(function(error){
       console.log("error : ", error);
       should.not.exist(error);
     });
   });
   it('validate a wrong hash', function () {
     return UnicAction.validateHash("sdsfkhqdkfjhf").then(function(result){
       should.exist(result);
       assert.equal(result, false);
     }).catch(function(error){
       should.not.exist(error);
     })
   });
    it('create an action with default time', function () {
     return UnicAction.create({action:'validateEmail'}).then(function(result){
       should.not.exist(result);
     }).catch(function(error){
       should.exist(error);
     });
   })

   it('create an empty/wrong action', function () {
     return UnicAction.create({duration:1000*60*10}).then(function(result){
       should.not.exist(result);
     }).catch(function(error){
       should.exist(error);
     });
   })

})
