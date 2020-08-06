module.exports = function(sequelize, DataTypes) {
    const Recipe = sequelize.define("Recipe", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      author: {
        type: DataTypes.INTEGER
      },
      category: {
          type: DataTypes.INTEGER
      },
      ingredients: {
          type: DataTypes.TEXT
      },
      steps: {
          type: DataTypes.TEXT
      },
      time: {
          type: DataTypes.INTEGER
      },
      picture: {
          type: DataTypes.STRING
      },
      visility: {
          type: DataTypes.INTEGER
      }
    });
  
    Recipe.associate = function(models) {
        Recipe.hasMany(models.Comment, {
        onDelete: "cascade"
      });
    };
    return Recipe;
  };