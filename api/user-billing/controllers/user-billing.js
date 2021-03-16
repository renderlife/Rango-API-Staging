const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["user-billing"].search({ user: ctx.state.user.id }, ctx.query);
    } else {
      entities = await strapi.services["user-billing"].find({ user: ctx.state.user.id },ctx.query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models["user-billing"] }));
  },

  async create(ctx) {
    let entity;

    ctx.request.body.user = ctx.state.user;

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["user-billing"].create(data, { files });
    } else {
      entity = await strapi.services["user-billing"].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models["user-billing"] });
  },

};