import Config from './Config';

const API =class {

    static getCategoryUrl = (userId, category) => Config.staticAssets +"/uploads/" + userId + "-c-" + category.toLowerCase().replace(" ","-");
    static getRemuneratorUrl = (userId, fullName) => Config.staticAssets + "/uploads/" + userId + "-r-" + fullName.toLowerCase().replace(" ","-");
    static getMonthImageUrl = (monthCategories) => this.staticAssets + "/month/" + (monthCategories.month).toString().padStart(2,"0") + ".jpg"
}
export default API;