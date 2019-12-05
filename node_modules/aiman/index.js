var Man = require('./lib/manjs');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Man === 'undefined') {
    window.Man = Man;
}

module.exports = Man;
