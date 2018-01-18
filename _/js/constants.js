var PBConstants = {
  // Script.js constants
  // URLS
  BASE_API_URL: window.location.origin,
  DATA_API_URL: '/monitoring/data',

  MARKET_CAP_LIMIT: 21,
  MARKET_CAP_CONVERT: 'usd',

  MIN_WIDTH_TO_SHOW_MENU: 770,
  TITLE_PROFIT_TRAILER: 'ProfitTrailer Monitor',
  HEIGHT_REMOVE_TO_FIX_SCROLLBAR: 26,
  SUCCESS_CODE: 200,

  // Configurations
  REFRESH_TIMER: 10000,

  MARKET_CAP_CURRENCY: 'BTC',
  POSITIVE_CLASS_TEXT: 'text-success',
  NEGATIVE_CLASS_TEXT: 'text-danger',
  HIDE_MARKET_PRICE_ROW_COMPARISION: 'USDT',
  HIDE_PROFIT_MARKET_AND_ESTIMATED_USD: 'USDT',
  DEFAULT_PRECISION: 8,
  RECORDS_COUNT_HIGHLIGHT_CLASS: 'text-primary',

  // MESSAGES
  AJAX_ERROR_MSG: 'There was an error while refreshing the data. ' +
    'Please check your VPS / PT connection. If your VPS / PT are fine, ' +
    'please have a beer and a smoke, this should fix itself.',
  PROCESSING_ERR: 'There was an error while processing the data received from ProfitTrailer. ' +
    'Please give ProfitTrailer some love, make a coffee and all will be good soon.',
  CONFIGURATION_SUCCESS_MSG: 'You have successfully saved the data',
  CONFIGURATION_NOT_SAVED: 'Changes that you made are not saved. Do you still want to leave this page?',

  // DT helper constants
  PROFIT_GREEN: 0,
  POSITIVE_CLASS: 'tdgreen',
  NEGATIVE_CLASS: 'tdred',
  FEE_LESS_THAN_ONE: 0.005,
  FEE_GREATER_THAN_ONE: 0.0025
};

// URLs
PBConstants.MARKET_CAP_API_URL = 'https://api.coinmarketcap.com/v1/ticker/?convert=' + PBConstants.MARKET_CAP_CONVERT +
  '&limit=' + PBConstants.MARKET_CAP_LIMIT;

// DT helper constants
PBConstants.POSSIBLE_CLASSES = PBConstants.POSITIVE_CLASS_TEXT + ' ' + PBConstants.NEGATIVE_CLASS_TEXT;
