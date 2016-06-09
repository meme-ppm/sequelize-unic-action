var Sequelize = require('sequelize');
var shortId = require("shortid");


module.exports.model = {
  hash: {type:Sequelize.STRING, defaultValue: shortId.generate(), primaryKey: true},
  action: {type:Sequelize.STRING, allowNull: false},
  limitDateValidity: {type: Sequelize.DATE},
  isUsed:{type: Sequelize.BOOLEAN, defaultValue:false}
}

module.exports.methods={
  classMethods:{
    createHash: function(obj){
      var duration = obj.duration;
      delete obj.duration;
      if(duration != null){
        duration = 1000 * 60 * 60 * 24;
      }
      obj.limitDateValidity = new Date(new Date().getTime() + duration);
      return this.create(obj);
    },
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
