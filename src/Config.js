module.exports = class Config {

    static apiEndpoint = "http://192.168.0.130:3030";
    static staticAssets = "http://192.168.0.130:3030/static/";
    static locale = "de";
    static dateTimeFormat = { year: 'numeric', month: '2-digit', day: '2-digit' };
    static pickerDateTimeFormat = "dd.MM.yyyy";
    static dateTimeFormatMonthName = {month:'long', year:'numeric'};
    static criticalThreshold = 0.95;

    static toCurrencyValue = value => value.toFixed(2) + "\u00a0€";
    static getCategoryUrl = (category) => this.staticAssets +"/categories/" + category.toLowerCase().replace(" ","-") + ".png";
    static getAvatarUrl = (fullName) => this.staticAssets + "/avatars/" + fullName.toLowerCase().replace(" ","-") + ".jpg";
    static getMonthImageUrl = (monthCategories) => this.staticAssets + "month/" + (monthCategories.month).toString().padStart(2,"0") + ".jpg"
}