'use strict';

import MobileConfigPayload from './payload.mjs';

import { toSafeString } from '../safe.mjs';

/**
 * @description generates a plist safe whitelist list
 * @author Steven Collins <steven@carboncollins.uk>
 * @param {Object[]} value an array of whitelist objects
 * @returns {Object[]} an array of plist safe whitelist objects
 */
function toSafeWhitelist(value) {
  if (value === undefined || value === null || !Array.isArray(value)) {
    return null;
  }
  const whitelist = [];

  for (let i = 0, iLength = value.length; i < iLength; i += 1) {
    const deviceId = toSafeString(value[i].deviceId);

    if (deviceId !== null) {
      whitelist.push({ DeviceID: deviceId });
    }
  }

  return (whitelist.length === 0)
    ? null
    : whitelist;
}

/**
 * @description generates a plist safe password list
 * @author Steven Collins <steven@carboncollins.uk>
 * @param {Object[]} value an arrray of airplay password objects
 * @returns {Object[]} an array of airplay password objects
 */
function toSafePasswords(value) {
  if (value === undefined || value === null || !Array.isArray(value)) {
    return null;
  }
  const passwords = [];

  for (let i = 0, iLength = value.length; i < iLength; i += 1) {
    const deviceName = toSafeString(value[i].deviceName);
    const deviceId = toSafeString(value[i].deviceId);
    const password = toSafeString(value[i].password);

    if (deviceName !== null && deviceId !== null && password !== null) {
      passwords.push({ DeviceName: deviceName, DeviceID: deviceId, Password: password });
    }
  }

  return (passwords.length === 0)
    ? null
    : passwords;
}

/**
 * @class
 * @description A class for containing all of the common structure data used in an AirPlay payload
 * @extends MobileConfigPayload
 * @author Steven Collins <CarbonCollins>
 * @date 27th April 2018
 */
export default class AirPlayPayload extends MobileConfigPayload {
  /**
   * @constructor
   * @description creates an instance of AirPlayPayload
   * @param {Object|AirPlayPayload} [options={}] An object of options
   * @author Steven Collins <CarbonCollins>
   * @date 27th April 2018
   */
  constructor(options = {}) {
    super(Object.assign({}, options, { type: 'com.apple.airplay' }));

    this.whitelist = options.whitelist || []; // array of strings, each being an airplay id
    this.passwords = options.passwords || []; // array of objects in the following format:
    // { deviceName: '', deviceId: '', password: '' }
  }

  /**
   * @description generates a plist safe js object to be converted into plist xml
   * @readonly
   * @memberof AirPlayPayload
   */
  get plistSafeObject() {
    const plistObj = {
      Whitelist: toSafeWhitelist(this.whitelist.slice(0)),
      Passwords: toSafePasswords(this.passwords.slice(0))
    };

    return Object.assign({}, super.plistSafeObject, plistObj);
  }
}
