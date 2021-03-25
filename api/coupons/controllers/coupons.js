const { sanitizeEntity } = require('strapi-utils');

module.exports = {

  async checkCoupon(ctx) {
    
    const { name } = ctx.request.query;

    coupon = await strapi.services.coupons.findOne({name: name});

    if(coupon) {
        var date = new Date();
        var currentDate = new Date(date.setHours(date.getHours() - 3)); // Brazil
        var couponDate = new Date(coupon.validThru);

        if(currentDate <= couponDate) {
            if(coupon.singleUse) { 
                var alreadyUsed = await strapi.services.orders.findOne({user: ctx.state.user.id, coupon: coupon.id});

                if(alreadyUsed) return ctx.unauthorized(message = 'Single-Use Coupon already used');
                
                var numberofUses = await strapi.services.orders.count({coupon: coupon.id});
                
                if(numberofUses < coupon.numberOfCoupons) {
                    return coupon;
                } else return ctx.unauthorized(message = 'Coupon usage limit reached');                
            } else {
                var numberofUses = await strapi.services.orders.count({coupon: coupon.id});
                
                if(numberofUses < coupon.numberOfCoupons) {
                    return coupon;
                } return ctx.unauthorized(message = 'Coupon usage limit reached');               
            }
        } else {
            return ctx.unauthorized(message = 'Coupon expired');
        }
    } else {
        return ctx.notFound(message = 'Coupon does not exist');
    }
  },
};
