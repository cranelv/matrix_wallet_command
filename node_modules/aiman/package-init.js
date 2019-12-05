/* jshint ignore:start */


// Browser environment
if(typeof window !== 'undefined') {
    Man = (typeof window.Man !== 'undefined') ? window.Man : require('manjs');
    BigNumber = (typeof window.BigNumber !== 'undefined') ? window.BigNumber : require('bignumber.js');
}


// Node environment
if(typeof global !== 'undefined') {
    Man = (typeof global.Man !== 'undefined') ? global.Man : require('manjs');
    BigNumber = (typeof global.BigNumber !== 'undefined') ? global.BigNumber : require('bignumber.js');
}

/* jshint ignore:end */
