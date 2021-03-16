module.exports = {
  
    async create(data, { files } = {}) {
      const validData = await strapi.entityValidator.validateEntity(strapi.models.orders, data);
      const entry = await strapi.query('orders').create(validData);
  
      if (files) {
        // automatically uploads the files based on the entry and the model
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'orders',
          // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
        });
        return this.findOne({ id: entry.id });
      }
  
      return entry;
    },
  };