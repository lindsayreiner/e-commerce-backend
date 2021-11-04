const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


router.get('/', async (req, res) => {
    try {
        const productData = await Product.findAll({
            include: [Category, Tag]
        });
        res.status(200).json(productData);

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productData = await Product.findByPk(req.params.id);
        res.status(200).json(productData);
        include: [{ model: Category, through: ProductTag }];
        include: [{ model: Tag, through: ProductTag }];
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    /* req.body should look like this...
      {
        product_name: "Basketball",
        price: 200.00,
        stock: 3,
        tagIds: [1, 2, 3, 4]
      }
    */
    Product.create(req.body)
        .then((product) => {
            if (req.body.tagIds.length) {
                const productTagIdArr = req.body.tagIds.map((tag_id) => {
                    return {
                        product_id: product.id,
                        tag_id,
                    };
                });
                return ProductTag.bulkCreate(productTagIdArr);
            }
            res.status(200).json(product);
        })
        .then((productTagIds) => res.status(200).json(productTagIds))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});


router.put('/:id', (req, res) => {
    Product.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
        .then((product) => {
            return ProductTag.findAll({ where: { product_id: req.params.id } });
        })
        .then((productTags) => {
            const productTagIds = productTags.map(({ tag_id }) => tag_id);

            const newProductTags = req.body.tagIds
                .filter((tag_id) => !productTagIds.includes(tag_id))
                .map((tag_id) => {
                    return {
                        product_id: req.params.id,
                        tag_id,
                    };
                });

            const productTagsToRemove = productTags
                .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                .map(({ id }) => id);


            return Promise.all([
                ProductTag.destroy({ where: { id: productTagsToRemove } }),
                ProductTag.bulkCreate(newProductTags),
            ]);
        })
        .then((updatedProductTags) => res.json(updatedProductTags))
        .catch((err) => {

            res.status(400).json(err);
        });
});

router.delete('/:id', async (req, res) => {
    try {
        const tagData = await Tag.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!tagData) {
            res.status(404).json({ message: 'No tag found with this id!' });
            return;
        }

        res.status(200).json({ message: 'Deleted ' + req.params.id + ' successfully!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
