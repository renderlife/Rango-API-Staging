const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const { authTokenizedCard, captureTransaction, chargeTokenizedCard, cancelTransaction } = require('./../../custom/controllers/Custom');
//var oneSignal = require('onesignal')('Yzc0NDRiOTYtY2JhYy00NDNhLTg1N2YtY2Q5Y2YwNzMzY2Rh', 'd559ec83-479d-462f-b163-32657eb2487f', true);
const OneSignal = require('onesignal-node');    
const client = new OneSignal.Client('d559ec83-479d-462f-b163-32657eb2487f', 'Yzc0NDRiOTYtY2JhYy00NDNhLTg1N2YtY2Q5Y2YwNzMzY2Rh'); 

module.exports = {
  async create(ctx) {

    let entity;
    
    // Check if User is using the default payment method
    const currentCreditcard = await this.checkUserPaymentMethod(ctx);

    if(currentCreditcard instanceof Error){
      return ctx.unauthorized(message = "Unable to fetch not owner CreditCard");
    }

    // Try to Authorize User Credit Card
    const authCreditCard = await authTokenizedCard(ctx, currentCreditcard);  

    if(authCreditCard instanceof Error || !authCreditCard){
      if (authCreditCard.response) {
        return authCreditCard.response.data;
      } 
      else if (authCreditCard.request) {
        return "3rd party payment server did not respond"
      } 
      else {
        return authCreditCard.message;
      }
    }
    
    else if(authCreditCard.Payment.Status !== 1){
      return {
        "Status": authCreditCard.Payment.Status,
        "Message": authCreditCard.Payment.ReturnMessage,
        "Code": authCreditCard.Payment.ReturnCode
      }
    }

    else{

      // Capture the authorized transaction
      const captureCreditCard = await captureTransaction(authCreditCard.Payment.PaymentId);

      if(captureCreditCard instanceof Error || !captureCreditCard){
        if (captureCreditCard.response) {
          return captureCreditCard.response.data;
        } 
        else if (captureCreditCard.request) {
          return "3rd party payment server did not respond"
        } 
        else {
          return captureCreditCard.message;
        }
      }

      else if(captureCreditCard.Status !== 2){
        return {
          "Status": authCreditCard.Payment.Status,
          "Message": authCreditCard.Payment.ReturnMessage,
          "Code": authCreditCard.Payment.ReturnCode
        }
      }

      else{
        ctx.request.body.user = ctx.state.user;
        ctx.request.body.payment.paymentId = authCreditCard.Payment.PaymentId;
        ctx.request.body.payment.tId = authCreditCard.Payment.Tid;
      
        entity = await strapi.services.orders.create(ctx.request.body);

        await strapi.emitNewIncomingOrderAlert(ctx.request.body.restaurant);

        return sanitizeEntity(entity, { model: strapi.models.orders });
      }
    }
  },

  async update(ctx) {
    const { id } = ctx.params;

    if(ctx.request.body.status === "canceled"){

      const order = await strapi.query('orders').findOne({id: id});

      if(ctx.state.user && ( ctx.state.user.id === order.user || ctx.state.user.id === order.restaurant ) && order.status === "created"){
        
        const canceledTransaction = await cancelTransaction(order.payment.paymentId);

        if(canceledTransaction instanceof Error || !canceledTransaction){
          if (canceledTransaction.response) {
            return canceledTransaction.response.data;
          } 
          else if (canceledTransaction.request) {
            return "3rd party payment server did not respond"
          } 
          else {
            return canceledTransaction.message;
          }
        }
  
        else if(canceledTransaction.Status !== 10){
          return {
            "Status": canceledTransaction.Payment.Status,
            "Message": canceledTransaction.Payment.ReturnMessage,
            "Code": canceledTransaction.Payment.ReturnCode
          }
        }

        else{
          let entity;
          if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.orders.update({ id }, data, {
              files,
            });
          } else {

            entity = await strapi.services.orders.update({ id }, ctx.request.body);
          }

          await strapi.emitChangedOrderStatusAlert(entity.user, entity.status);

          return sanitizeEntity(entity, { model: strapi.models.orders });
        }
      }
      else{
        switch (order.status) {
          case "confirmed":
            return ctx.unauthorized(message = "O pedido não pode ser cancelado pois já está sendo preparado pelo restaurante");

          case "ready":
            return ctx.unauthorized(message = "O pedido não pode ser cancelado pois já foi preparado pelo restaurante");

          default:
            return ctx.unauthorized(message = "Não foi possível cancelar o pedido.");
        }
      }
    }
    else{

      let entity;
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await strapi.services.orders.update({ id }, data, {
          files,
        });
      } else {

        entity = await strapi.services.orders.update({ id }, ctx.request.body);
      }

      await strapi.emitChangedOrderStatusAlert(entity.user, entity.status);

      currentUser = await strapi.query('user', 'users-permissions').findOne({id: entity.user});

      if(entity.status == "confirmed"){
        //await oneSignal.createNotification("Oba! O seu pedido foi confirmado e já está sendo preparado pelo restaurante :)", {}, [currentUser.oneSignalId]);
        const notification = {
          contents: {
            'en': 'Oba! O seu pedido foi confirmado e já está sendo preparado pelo restaurante.'
          },
          include_player_ids: [currentUser.oneSignalId],
          android_channel_id: "0cdc4039-80fc-414d-b2e2-85d99a6e95b5"
        };

        try {
          const response = await client.createNotification(notification);
          console.log(response.body.id);
          console.log("deu certo");
        } catch (e) {
          if (e instanceof OneSignal.HTTPError) {
            // When status code of HTTP response is not 2xx, HTTPError is thrown.
            console.log(e.statusCode);
            console.log(e.body);
            console.log("deu ruimmmmmmmmm");
          }
        }

      }

      if(entity.status == "ready"){
        //await oneSignal.createNotification("Seu #RanGo acabou de ficar pronto!", {}, [currentUser.oneSignalId]);

        const notification = {
          contents: {
            'en': 'Seu #RanGo acabou de ficar pronto!'
          },
          include_player_ids: [currentUser.oneSignalId],
          android_channel_id: "0cdc4039-80fc-414d-b2e2-85d99a6e95b5"
        };

        try {
          const response = await client.createNotification(notification);
          console.log(response.body.id);
          console.log("deu certo");
        } catch (e) {
          if (e instanceof OneSignal.HTTPError) {
            // When status code of HTTP response is not 2xx, HTTPError is thrown.
            console.log(e.statusCode);
            console.log(e.body);
            console.log("deu ruimmmmmmmmm");
          }
        }

      }

      return sanitizeEntity(entity, { model: strapi.models.orders });
    }
  },

  async checkUserPaymentMethod(ctx){
    
    userBillings = await strapi.query('user-billing').find({user: ctx.state.user.id});
    currentCreditCard = userBillings.find(card => card.id === ctx.request.body.payment.user_billing);
  
    if(!currentCreditCard || currentCreditCard == undefined){
      return new Error(message = "Unauthorized to fetch card from another user")
    }

    else{
      if(!currentCreditCard.default){

        userBillings.forEach( async function(card){
          var id = card.id;
          if(currentCreditCard.id === card.id){
            card.default = true;
            await strapi.services["user-billing"].update({ id }, card);
          }
          else{
            card.default = false;
            await strapi.services["user-billing"].update({ id }, card);
          }
        });
      }
  
      return currentCreditCard;
    }
  }
};
