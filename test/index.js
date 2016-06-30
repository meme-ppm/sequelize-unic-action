var assert = require('chai').assert;
var should = require('chai').should();
var Sequelize = require('sequelize');
var db = new Sequelize('postgresql://test1:test1@localhost/test1');
var UnicActionModel = require('../index.js');
var UnicAction = db.define('unic', UnicActionModel.model, UnicActionModel.methods);


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
   it('create a valid action and redeem an action with validate without action', function () {
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
   it('create a valid action and redeem an action with validate declaring action', function () {
     return UnicAction.create({action:"validateEmail", duration:1000*60*10, limitDateValidity:null}).then(function(result){
       should.exist(result, 'create unic action ok');
       result.should.be.an('object');
       assert.equal(result.isUsed, false);
      return UnicAction.validateHash(result.hash, 'validateEmail');
    }).then(function(result){
      should.exist(result);
      assert.equal(result, true);
      return result;
    }).catch(function(error){
       console.log("error : ", error);
       should.not.exist(error);
     });
   });
   it('create a valid action and wrong redeem an action with wrong declaring action', function () {
     return UnicAction.create({action:"validateEmail", duration:1000*60*10, limitDateValidity:null}).then(function(result){
       should.exist(result, 'create unic action ok');
       result.should.be.an('object');
       assert.equal(result.isUsed, false);
      return UnicAction.validateHash(result.hash, '****');
    }).then(function(result){
      should.not.exist(result);
    }).catch(function(error){
       console.log("error : ", error);
       should.exist(error);
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
    it('create an action with the default time', function () {
     return UnicAction.create({action:'validateEmail'}).then(function(result){
       should.not.exist(result);
     }).catch(function(error){
       should.exist(error);
     });
   })

   it('test generateWhereFromHash - hash', function () {
     var hash = "fdjqhdkjh";
     var where = UnicActionModel.generateWhereFromHash(hash);
     should.exist(where);
     assert.equal(where.hash, hash);
     assert.equal("action" in where, false);
   })

   it('test generateWhereFromHash - hash and action', function () {
     var hash = "fdjqhdkjh";
     var action = "beautifullaction"
     var where = UnicActionModel.generateWhereFromHash(hash, action);
     should.exist(where);
     assert.equal(where.hash, hash);
     assert.equal(where.action, action);
   })

   it('test generateWhereFromHash - empty hash should generate exception', function () {
     try{
       UnicActionModel.generateWhereFromHash();
     }catch(error){
        should.exist(error);
     }
   })


})
