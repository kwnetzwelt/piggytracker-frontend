const Config =class {

    static googleClientId = "$(GOOGLE_CLIENT_ID)";

    /** The API Endpoint (backend) to connect to */
    static apiEndpoint = "https://api.piggytracker.org";
    /** For almost all calls we will use this as a prefix route */
    static apiEndpointPrefixRoute = "/api/v1";
    /** The locale to use. Either something like "de" or "de_DE" is valid here. It is used for date formatting. */
    static locale = "de";
    /** Date Time format used in the entries list */
    static dateTimeFormat = { year: 'numeric', month: '2-digit', day: '2-digit' };
    /** Date Time format used when picking a date for a single entry */
    static pickerDateTimeFormat = "dd.MM.yyyy";
    /** Date Time format used in the title of a month card */
    static dateTimeFormatMonthName = {month:'long', year:'numeric'};
    /** When the amount spent over the target amount is higher than this threshold, we will highlight the amount. */
    static criticalThreshold = 0.95;
    /** Currenty display according to your used currency. */
    static toCurrencyValue = value => value.toFixed(2) + "\u00a0€";
    /** The base url of all static assets like category, month and avatar images. */
    static staticAssets = "https://api.piggytracker.org/static";
    /** Getters for static content urls*/
    static getCategoryUrl = (category) => this.staticAssets +"/categories/" + category.toLowerCase().replace(" ","-") + ".png";
    static getAvatarUrl = (fullName) => this.staticAssets + "/avatars/" + fullName.toLowerCase().replace(" ","-");
    static getMonthImageUrl = (monthCategories) => this.staticAssets + "/month/" + (monthCategories.month).toString().padStart(2,"0") + ".jpg"
}
export default Config;