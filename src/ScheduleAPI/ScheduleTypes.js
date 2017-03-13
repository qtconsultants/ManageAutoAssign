/**
 * Created by kgrube on 3/13/2017.
 */
/**
 * @private
 */
var Q = require('q'),
  inherits = require('util').inherits,
  ConnectWise = require('../ConnectWise.js');

/**
 * @typedef {object} ScheduleType
 * @property {number} id
 * @property {string} name - required
 * @property {string} identifier - required
 * @property {ChargeCodeHref} chargeCode
 * @property {ServiceLocationHref} where
 * @property {boolean} systemFlag
 *
 */

/**
 *
 * @param {CWOptions} options
 * @inherits {ConnectWise}
 * @constructor
 */
function ScheduleType(options) {
  ConnectWise.apply(this, Array.prototype.slice.call(arguments));
}
inherits(ScheduleType, ConnectWise);

/**
 * @param {Params} params
 * @returns {Promise<ScheduleType[]>}
 */
ScheduleType.prototype.getScheduleTypes = function (params) {
  return this.api('/schedule/types', 'GET', params);
};

/**
 *
 * @param {ScheduleEntry} scheduleType
 * @returns {Promise<ScheduleType>}
 */
ScheduleType.prototype.createScheduleType = function (scheduleType) {
  return this.api('/schedule/types', 'POST', scheduleType);
};

/**
 *
 * @param {ParamsConditions} params
 * @returns {Promise<Count>}
 */
ScheduleType.prototype.getScheduleTypesCount = function (params) {
  return this.api('/schedule/types/count', 'GET', params);
};

/**
 *
 * @param scheduleTypeId
 * @returns {Promise<ScheduleType>}
 */
ScheduleType.prototype.getScheduleTypeById = function(scheduleTypeId) {
  return this.api('/schedule/types/' + scheduleTypeId, 'GET');
};

/**
 *
 * @param scheduleTypeId
 * @returns {Promise<DeleteResponse>}
 */
ScheduleType.prototype.deleteScheduleTypeById = function(scheduleTypeId) {
  return this.api('/schedule/types/' + scheduleTypeId, 'DELETE');
};

/**
 *
 * @param scheduleTypeId
 * @param {ScheduleType} scheduleType
 * @returns {Promise<ScheduleType>}
 */
ScheduleType.prototype.replaceScheduleType = function(scheduleTypeId, scheduleType) {
  return this.api('/schedule/types/' + scheduleTypeId, 'PUT', scheduleType);
};

/**
 * @param scheduleTypeId
 * @param {Operations} ops
 * @returns {Promise<ScheduleType>}
 */
ScheduleType.prototype.updateScheduleType = function(scheduleTypeId, ops) {
  return this.api('/schedule/types/' + scheduleTypeId, 'PATCH', ops);
};


/**
 *
 * @type {ScheduleType}
 */
module.exports = ScheduleType;
