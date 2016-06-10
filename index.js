var Sequelize = require('sequelize');
var shortId = require("shortid");


module.exports.model = {
  hash: {type:Sequelize.STRING, defaultValue: shortId.generate(), primaryKey: true},
  action: {type:Sequelize.STRING, allowNull: false},
  duration: {type:Sequelize.INTEGER, defaultValue: 1000 * 60 * 60 * 24},
  limitDateValidity: {type: Sequelize.DATE},
  isUsed:{type: Sequelize.BOOLEAN, defaultValue:false}
}

module.exports.methods={
  hooks: {
    beforeValidate: function(unicAction, options) {
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
    }
  },
  instanceMethods:{
    hashIsUsed: function(){
      return this.update({isUsed: true});
    }
  }
}
