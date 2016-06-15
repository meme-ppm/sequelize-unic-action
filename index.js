var Sequelize = require('sequelize');
var uuid = require("uuid");

var generateWhereFromHash = function(hash, action){
  if(!hash){
    throw new Squelize.ValidationError("hash.notDefined");
  }
  var where = {
            hash:hash,
            limitDateValidity: {$gt: Date.now()},
            isUsed:false
          }
  if(action){
    where.action = action;
  }
  return where;
}

module.exports.model = {
  hash: {type:Sequelize.STRING, primaryKey: true},
  action: {type:Sequelize.STRING, allowNull: false},
  duration: {type:Sequelize.INTEGER, defaultValue: 1000 * 60 * 60 * 24},
  limitDateValidity: {type: Sequelize.DATE},
  isUsed:{type: Sequelize.BOOLEAN, defaultValue:false}
}

module.exports.generateWhereFromHash = generateWhereFromHash;

module.exports.methods={
  hooks: {
    beforeValidate: function(unicAction, options) {
      unicAction.hash = uuid.v4();
      unicAction.limitDateValidity =  new Date(new Date().getTime() + unicAction.duration);
    }
  },
  classMethods:{
    findHash: function(hash, action){
      return this.findOne({
                    where: generateWhereFromHash(hash, action)
                  });
    },
    hashIsUsed: function(hash){
      return this.update({isUsed:true}, {where:{hash:hash}});
    },
    validateHash:function(hash, action){
      return this.findHash(hash, action).then(function(result){
        if(result){
          return result.hashIsUsed().then(function(){
            return true;
          })
        }
        return false;
      });

    }
  },
  instanceMethods:{
    hashIsUsed: function(){
      return this.update({isUsed: true});
    }
  }
}
