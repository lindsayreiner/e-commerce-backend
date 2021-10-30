// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category// product is source and category is target
Product.belongsTo(Category, {
    foreignKey: 'category_id',
    onDelete: 'CASCADE'
});

// Categories have many Products category is srouce and product is target
Category.hasMany(Product, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE'
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
    through: 'ProductTag'
})

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(ProductTag, {
    through: 'ProductTag'
})

module.exports = {
    Product,
    Category,
    Tag,
    ProductTag,
};