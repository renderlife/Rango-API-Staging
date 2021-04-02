const { sanitizeEntity } = require('strapi-utils');
const { startOfWeek, subDays, lastDayOfWeek, startOfMonth, startOfDay } = require('date-fns');
const haversine = require('haversine');
const axios = require('axios');
const utf8 = require('utf8');

"use strict";

module.exports = {
  async logout(ctx) {

    ctx.cookies.set("authToken", '', {
      domain:  "rangosemfila.com.br"
    });

    ctx.send({
      authorized: true,
      message: "Session finished",
    });
  },

  async findOrdersThisWeek(ctx) {

    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{

      const currentDate = new Date();
      const firstDayOfWeek = startOfWeek(currentDate);
      
      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: firstDayOfWeek,
        created_at_lt: currentDate, 
      });

      var sunday = 0;
      var monday = 0;
      var tuesday = 0;
      var wednesday = 0;
      var thursday = 0;
      var friday = 0;
      var saturday = 0;

      entities.forEach(entity => {
        const date = new Date(entity.created_at);
        switch(date.getDay()){
          case 0: sunday++;
            break;
          case 1: monday++;
            break;
          case 2: tuesday++;
            break;
          case 3: wednesday++;
            break;
          case 4: thursday++;
            break;
          case 5: friday++;
            break;
          case 6: saturday++;
            break;
        };
      });

      const object = {
        "Sunday": sunday,
        "Monday": monday,
        "Tuesday": tuesday,
        "Wednesday": wednesday,
        "Thursday": thursday,
        "Friday": friday,
        "Saturday": saturday
      };

      return object; 
    }
  },

  async findOrdersLastWeek(ctx) {

    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{

      var currentDate = new Date();

      currentDate = subDays(currentDate, 7);

      const firstDayOfLastWeek = startOfWeek(currentDate);
      const lastDayOfLastWeek = lastDayOfWeek(currentDate);
      
      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: firstDayOfLastWeek,
        created_at_lt: lastDayOfLastWeek, 
      });

      var sunday = 0;
      var monday = 0;
      var tuesday = 0;
      var wednesday = 0;
      var thursday = 0;
      var friday = 0;
      var saturday = 0;

      entities.forEach(entity => {
        const date = new Date(entity.created_at);
        switch(date.getDay()){
          case 0: sunday++;
            break;
          case 1: monday++;
            break;
          case 2: tuesday++;
            break;
          case 3: wednesday++;
            break;
          case 4: thursday++;
            break;
          case 5: friday++;
            break;
          case 6: saturday++;
            break;
        };
      });

      const object = {
        "Sunday": sunday,
        "Monday": monday,
        "Tuesday": tuesday,
        "Wednesday": wednesday,
        "Thursday": thursday,
        "Friday": friday,
        "Saturday": saturday
      };

      return object;
    }
  },

  async findRevenuesThisWeek(ctx){
    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{

      const currentDate = new Date();
      const firstDayOfWeek = startOfWeek(currentDate);

      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: firstDayOfWeek,
        created_at_lt: currentDate, 
      });

      var sunday = 0;
      var monday = 0;
      var tuesday = 0;
      var wednesday = 0;
      var thursday = 0;
      var friday = 0;
      var saturday = 0;

      entities.forEach(entity => {
        const date = new Date(entity.created_at);
        switch(date.getDay()){
          case 0: sunday += entity.payment.total;
            break;
          case 1: monday += entity.payment.total;
            break;
          case 2: tuesday += entity.payment.total;
            break;
          case 3: wednesday += entity.payment.total;
            break;
          case 4: thursday += entity.payment.total;
            break;
          case 5: friday += entity.payment.total;
            break;
          case 6: saturday += entity.payment.total;
            break;
        };
      });

      const object = {
        "Sunday": sunday,
        "Monday": monday,
        "Tuesday": tuesday,
        "Wednesday": wednesday,
        "Thursday": thursday,
        "Friday": friday,
        "Saturday": saturday
      };

      return object;
    }
  },

  async findRevenuesLastWeek(ctx){
    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{

      var currentDate = new Date();

      currentDate = subDays(currentDate, 7);

      const firstDayOfLastWeek = startOfWeek(currentDate);
      const lastDayOfLastWeek = lastDayOfWeek(currentDate);

      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: firstDayOfLastWeek,
        created_at_lt: lastDayOfLastWeek, 
      });

      var sunday = 0;
      var monday = 0;
      var tuesday = 0;
      var wednesday = 0;
      var thursday = 0;
      var friday = 0;
      var saturday = 0;

      entities.forEach(entity => {
        const date = new Date(entity.created_at);
        switch(date.getDay()){
          case 0: sunday += entity.payment.total;
            break;
          case 1: monday += entity.payment.total;
            break;
          case 2: tuesday += entity.payment.total;
            break;
          case 3: wednesday += entity.payment.total;
            break;
          case 4: thursday += entity.payment.total;
            break;
          case 5: friday += entity.payment.total;
            break;
          case 6: saturday += entity.payment.total;
            break;
        };
      });

      const object = {
        "Sunday": sunday,
        "Monday": monday,
        "Tuesday": tuesday,
        "Wednesday": wednesday,
        "Thursday": thursday,
        "Friday": friday,
        "Saturday": saturday
      };

      return object;
    }
  },

  async findOrdersByCategoryThisWeek(ctx){

    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{

      const currentDate = new Date();
      const firstDayOfWeek = startOfWeek(currentDate);

      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: firstDayOfWeek,
        created_at_lt: currentDate, 
      });

      items_categories = await strapi.query('menu-items-categories').find({
        restaurant: currentUser.restaurant
      });

      var arr = [];

      entities.forEach(entity => {
        entity.data.forEach(entry => {
          var aux = items_categories.find(o => o.id === entry.menu_item.menu_item_category);
          var result = arr.find(o => o.category === aux.name);
          if(result){
            result.orders += 1*entry.quantity;
          }
          else{
            arr.push({
              category: aux.name,
              orders: entry.quantity,
            });
          }
        });
      });

      return arr;
    }
  },

  async findOrdersByCategoryLastWeek(ctx){

    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{

      var currentDate = new Date();

      currentDate = subDays(currentDate, 7);

      const firstDayOfLastWeek = startOfWeek(currentDate);
      const lastDayOfLastWeek = lastDayOfWeek(currentDate);

      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: firstDayOfLastWeek,
        created_at_lt: lastDayOfLastWeek, 
      });

      items_categories = await strapi.query('menu-items-categories').find({
        restaurant: currentUser.restaurant
      });

      var arr = [];

      entities.forEach(entity => {
        entity.data.forEach(entry => {
          var aux = items_categories.find(o => o.id === entry.menu_item.menu_item_category);
          var result = arr.find(o => o.category === aux.name);
          if(result){
            result.orders += 1*entry.quantity;
          }
          else{
            arr.push({
              category: aux.name,
              orders: entry.quantity,
            });
          }
        });
      });

      return arr;
    }
  },

  async findResumeThisMonth(ctx){
    
    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{

      const currentDate = new Date();
      const firstDayOfMonth = startOfMonth(currentDate);

      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: firstDayOfMonth,
        created_at_lt: currentDate, 
      });

      var orders = 0;
      var revenue = 0;

      entities.forEach(entity => {
        orders += 1;
        revenue += entity.payment.total;
      });

      var result = {
        "orders": orders,
        "revenue": revenue
      }

      return result;
    }
  },

  async findResumeToday(ctx){

    const currentUser = ctx.state.user;

    if(!currentUser || currentUser.role.id != 3) return ctx.unauthorized(`Not authorized`);
    else{
      const currentDate = new Date();
      const startofToday = startOfDay(currentDate);

      entities = await strapi.query('orders').find({ 
        restaurant: currentUser.restaurant,
        created_at_gt: startofToday,
        created_at_lt: currentDate, 
      });

      var orders = 0;
      var revenue = 0;

      entities.forEach(entity => {
        orders += 1;
        revenue += entity.payment.total;
      });

      var result = {
        "orders": orders,
        "revenue": revenue
      }

      return result;
    }
  },

  async findRestaurantsByLocation(ctx){

    const { latitude, longitude, radius, orderByDistance, orderByWaitingTime, categories, search } = ctx.query;

    const start = {
      latitude: latitude,
      longitude: longitude
    };

    if(orderByWaitingTime) {
      if(categories !== undefined) {
        entities = await strapi.query('restaurant').find({category_in: categories, _sort: "estimatedDeliveryTime:asc"});
      } else {
        entities = await strapi.query('restaurant').find({_sort: "estimatedDeliveryTime:asc"});
      }
    } 
    else if (search !== undefined) {
      entities = await strapi.query('restaurant').find({name_contains: search});
    } else {
      if(categories !== undefined) {
        entities = await strapi.query('restaurant').find({category_in: categories});
      } else {
        entities = await strapi.query('restaurant').find();
      }
    }

    var foundRestaurants = [];

    entities.forEach(restaurant => {

      if(!restaurant.address.latitude || !restaurant.address.longitude) return 0;
        
      else{
        const end = {
          latitude: restaurant.address.latitude,
          longitude: restaurant.address.longitude
        };

        var result = parseFloat(haversine(start, end));
        
        if(result <= radius){
          restaurant.distance = result;
          foundRestaurants.push(restaurant);
        }
      }
    });

    if(orderByDistance && foundRestaurants !== null) {
      return foundRestaurants.sort((a,b) => (a.distance > b.distance) ? 1 : -1);
    } 

    return foundRestaurants;
  },

  async findRestaurantCoordinates(ctx){

    const params = ctx.request.body.address;
    const cep = utf8.encode(params.cep);
    const neighborhood = utf8.encode(params.neighborhood);
    const city = utf8.encode(params.city);

    var response;

    await axios.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + cep + "," + neighborhood +  "," + city + ",Brasil" + "&sensor=true+CA&key=" + process.env.GOOGLEGEOCODEAPIKEY).then( function(res){
      response = res.data;
    }).catch(function (error) {
      if (error.response) {
        // Request made and server responded
        response = error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        response = "3rd party server did not respond"
      } else {
        // Something happened in setting up the request that triggered an Error
        response = error.message;
      }
    });

    
    return response.results[0].geometry.location;
  },

  async tokenizeCard(ctx){

    const params = ctx.request.body;
    
    const config = {
      headers: {
        MerchantId: process.env.CIELOMERCHANTID,
        "Content-Type": "application/json",
        MerchantKey: process.env.CIELOMERCHANTKEY
      }
    };

    const data = {
      CustomerName : params.CustomerName,
      CardNumber: params.CardNumber,
      Holder: params.Holder,
      ExpirationDate: params.ExpirationDate,
      Brand: params.Brand
    };

    var response;

    await axios.post(process.env.CIELOAPIURL + "/1/card", data, config).then( function(res){
      response = res.data;
    }).catch(function (error) {
      if (error.response) {
        // Request made and server responded
        response = error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        response = "3rd party server did not respond"
      } else {
        // Something happened in setting up the request that triggered an Error
        response = error.message;
      }
  
    });

    return response;
  },

  async retrieveTokenizedCard(ctx){

    const cardToken = ctx.request.query.token;

    const config = {
      headers: {
        MerchantId: process.env.CIELOMERCHANTID,
        "Content-Type": "application/json",
        MerchantKey: process.env.CIELOMERCHANTKEY
      }
    };

    var response;

    await axios.get(process.env.CIELOAPIQUERYURL + "/1/card/" + cardToken, config).then( function(res){
      response = res.data;
    }).catch(function (error) {
      if (error.response) {
        // Request made and server responded
        response = error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        response = "3rd party server did not respond"
      } else {
        // Something happened in setting up the request that triggered an Error
        response = error.message;
      }
    });

    
    return response;
  },

  async authTokenizedCard(ctx, currentCreditCard){

    const params = ctx.request.body;
  
    const config = {
      headers: {
        MerchantId: process.env.CIELOMERCHANTID,
        "Content-Type": "application/json",
        MerchantKey: process.env.CIELOMERCHANTKEY
      }
    };

    const data = {
      MerchantOrderId: ctx.state.user.id,
      Customer: {  
        "Name" : ctx.state.user.username,
        "Email" : ctx.state.user.email,
        "Birthdate" : ctx.state.user.birthDate,
        "identityType" : "CPF",
        "identity" : ctx.state.user.cpf
      },
      Payment: {  
        "Type" : "CreditCard",
        "Amount" : params.payment.total * 100, 
        "Installments" : params.payment.installments,
        "SoftDescriptor" : " RanGo *",
        "CreditCard" : {  
          "CardToken" : currentCreditCard.cardToken
        }
      }
    }

    var response;

    await axios.post(process.env.CIELOAPIURL + "/1/sales", data, config).then( function(res){
      response = res.data;
    }).catch(function (error) {
      response = error;
    });

    return response;
  },

  async captureTransaction(paymentId){
  
    const config = {
      headers: {
        MerchantId: process.env.CIELOMERCHANTID,
        "Content-Type": "application/json",
        MerchantKey: process.env.CIELOMERCHANTKEY
      }
    };

    var response;

    await axios.put(process.env.CIELOAPIURL + "/1/sales/" + paymentId + "/capture", null, config).then( function(res){
      response = res.data;
    }).catch(function (error) {
      response = error;
    });

    return response;
  },

  async cancelTransaction(paymentId){

    const config = {
      headers: {
        MerchantId: process.env.CIELOMERCHANTID,
        "Content-Type": "application/json",
        MerchantKey: process.env.CIELOMERCHANTKEY
      }
    };

    var response;

    await axios.put(process.env.CIELOAPIURL + "/1/sales/" + paymentId + "/void", null, config).then( function(res){
      response = res.data;
    }).catch(function (error) {
      response = error;
    });

    return response;
  }
};