const { sanitizeEntity } = require('strapi-utils');
const { findRestaurantCoordinates } = require('./../../custom/controllers/Custom');

module.exports = {

  async create(ctx) {
    let entity;

    const restaurantCoordinates = await findRestaurantCoordinates(ctx);

    ctx.request.body.address.latitude = restaurantCoordinates.lat;
    ctx.request.body.address.longitude = restaurantCoordinates.lng;

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.restaurant.create(data, { files });
    } else {

      ctx.request.body.user = ctx.state.user;

      entity = await strapi.services.restaurant.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.restaurant });
  },

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.restaurant.search(ctx.query);
    } else {
      entities = await strapi.services.restaurant.find(ctx.query);
    }

    entities.forEach(restaurant => {
      delete restaurant.address;
      delete restaurant.billing;
      delete restaurant.legal;
    });

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.restaurant }));
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.restaurant.findOne({ id });

    if(ctx.state.user && ctx.state.user.restaurant === entity.id) return sanitizeEntity(entity, { model: strapi.models.restaurant });
    
    else{
      delete entity.address;
      delete entity.billing;
      delete entity.legal;

      return sanitizeEntity(entity, { model: strapi.models.restaurant });
    }
    
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    if(!(id == ctx.state.user.restaurant)) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.restaurant.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.restaurant.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.restaurant });
  },
};