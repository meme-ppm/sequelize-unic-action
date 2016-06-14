var Sequelize = require('sequelize');
var uuid = require("uuid");


module.exports.model = {
  hash: {type:Sequelize.STRING, primaryKey: true},
  action: {type:Sequelize.STRING, allowNull: false},
  duration: {type:Sequelize.INTEGER, defaultValue: 1000 * 60 * 60 * 24},
  limitDateValidity: {type: Sequelize.DATE},
  isUsed:{type: Sequelize.BOOLEAN, defaultValue:false}
}

module.exports.methods={
  hooks: {
    beforeValidate: function(unicAction, options) {
      unicAction.hash = uuid.v4();
      unicAction.limitDateValidity =  new Date(new Date().getTime() + unicAction.duration);
    }
  },
  classMethods:{
    findHash: function(hash){
      return this.findOne({
                    where: {
                              hash:hash,
                              limitDateValidity: {$gt: Date.now()},
                              isUsed:false
                            }
                  });
    },
    hashIsUsed: function(hash){
      return this.update({isUsed:true}, {where:{hash:hash}});
    },
    validateHash:function(hash){
      return this.findHash(hash).then(function(result){
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
