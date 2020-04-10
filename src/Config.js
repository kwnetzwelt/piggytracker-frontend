module.exports = {
    apiEndpoint : "http://192.168.0.130:3030",
    locale : "de",
    dateTimeFormat:{ year: 'numeric', month: 'numeric', day: '2-digit' },
    toCurrencyValue :  value => value.toFixed(2) + " €"
}