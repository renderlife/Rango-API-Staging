const { sanitizeEntity } = require('strapi-utils');
const haversine = require('haversine');


module.exports = {
  

  async findMatch(ctx) {

    var { latitude, longitude, radius, categories, numberOfResults } = ctx.request.query;

    if(numberOfResults === undefined || numberOfResults <= 0) numberOfResults = 10;
    if(radius === undefined || radius <= 0) radius = 10;
    if(latitude === undefined || longitude === undefined) return ctx.badRequest("Latitude and Longitude must not be null");
    if(categories === undefined || categories.length == 0) return ctx.badRequest("Categories must not be null");

    var result = "'" + categories.join("','") + "'";
   
    var restaurants = await strapi.connections.default.raw(
          `
          SELECT *, r.id as restaurant_id FROM restaurants as r inner join restaurants_components as c on c.restaurant_id = r.id
          AND c.field = 'address'
          inner join components_restaurant_addresses as cra on cra.id = c.component_id
          WHERE distancia_km(${latitude}, ${longitude},  latitude::numeric,  longitude::numeric) >= 0
          AND distancia_km(${latitude}, ${longitude},  latitude::numeric,  longitude::numeric) <= ${radius}
          AND ARRAY[r.category]::varchar[] && ARRAY[${result}]::varchar[]  
          `
    );

    var restaurantObjects = restaurants["rows"].map((item) => {
        return {
          "id": item["restaurant_id"],
          "name": item["name"],
          "phoneNumber": item["phoneNumber"],
          "estimatedDeliveryTime": item["estimatedDeliveryTime"],
          "largeImageUrl": item["largeImageUrl"],
          "thumbnailImageUrl": item["thumbnailImageUrl"],
          "openingTime": item["openingTime"],
          "closingTime": item["closingTime"],
          "minimumOrderValue": item["minimumOrderValue"],
          "category": item["category"],
          "status": item["status"],
          "confirmed": item["confirmed"],
          "created_at": item["created_at"],
          "updated_at": item["updated_at"]
        }
      });

      var restaurantsIdsList = [];
      
      for (var index = 0; index < restaurantObjects.length; index++) {
        restaurantsIdsList.push(restaurantObjects[index]["id"]);
      }

      var menuItems = await strapi.connections.default.raw(
        `
        SELECT * FROM menu_items as m WHERE ARRAY[m.restaurant]::integer[] && ARRAY[${restaurantsIdsList.join()}]::integer[]  
        order by random() limit ${numberOfResults} 
        `
      );

      var menuItemsObjects = menuItems["rows"].map((item) => {
        return {
          "id" : item["id"],
          "name" : item["name"],
          "description" : item["description"],
          "largeImageUrl" : item["largeImageUrl"],
          "thumbnailImageUrl" : item["thumbnailImageUrl"],
          "menu_item_category" : item["menu_item_category"],
          "price" : item["price"],
          "status" : item["status"],
          "onSale" : item["onSale"],
          "promotionalPrice" : item["promotionalPrice"],
          "menu_options_categories" : [],
          "restaurant" : restaurantObjects.find(r => r.id === item["restaurant"])
        };
      });

      return menuItemsObjects;
  },
};


  