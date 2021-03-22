const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  

  async findMatch(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["menu-items"].search(ctx.query);
    } else {
      entities = await strapi.services["menu-items"].find(ctx.query, ['restaurant']);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models["menu-items"] }));
  },
};