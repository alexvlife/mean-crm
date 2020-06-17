const moment = require('moment');
const Order = require('../models/Order');
const errorhandler =  require('../utils/errorHandler');

module.exports.overview = async function(req, res) {
  try {
    const allOrders = await Order.find({ user: req.user.id }).sort((a, b) => a - b);
    const ordersMap = getOrdersMap()

    /** Список заказов за предыдущий день */
    const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
    /** Количество заказов за предыдущий день */
    const yesterdayOrdersNumber = yesterdayOrders.length;

    /** Количество заказов всего */
    const totalOrdersNumber = allOrders.length;
    /** Количество дней всего */
    const daysNumber = Object.keys(ordersMap).length;
    /** Заказов в день */
    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
    /**
     * Процент для количества заказов
     * ((Кол-во заказов вчера / кол-во заказов в день) - 1) * 100
     */
    const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
  
    /** -------------------------------------------------- */
    
    /** Общая выручка */
    const totalGain = calculatePrice(allOrders);
    /** Выручка в день */
    const gainPerDay = totalGain / daysNumber;
    /** Выручка за предыдущий день */
    const yesterdayGain = calculatePrice(yesterdayOrders);
    /** Процент выручки */
    const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);

    /** -------------------------------------------------- */

    /** Сравнение выручки */
    const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
    /** Сравнение количества заказов */
    const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

    res.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+compareGain),
        yesterday: +yesterdayGain,
        isHigher: +gainPercent > 0, // Является ли выручка за предыдущий день выше, чем средняя выручка.
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: +ordersPercent > 0, // Является ли кол-во заказов за предыдущий день выше, чем среднее кол-во заказов.
      }
    });
  } catch (e) {
    errorhandler(res, e);
  }
}

module.exports.analytics = function(req, res) {

}

/**
 * @function getOrdersMap - группирует все заказы по дням.
 */
function getOrdersMap(orders = []) {
  const daysOrders = {}; // Пример данных: { '17.06.2020': [{}, {}, {}, ...] }

  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');

    /**
     * Система построена таким образом, что не учитывается текущий день (т.е. учитывается только предыдущий день).
     * Это означает, что нам не нужно считать текущий день.
     */
    if (date === moment().format('DD.MM.YYYY')) {
      return
    }

    if (!daysOrders[date]) {
      daysOrders[date] = [];
    }

    daysOrders[date].push(order)
  });

  return daysOrders;
}

/**
 * @function calculatePrice - вычисляет общую выручку по всем заказам.
 */
function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity;
    }, 0);
    return total += orderPrice;
  }, 0);
} 
