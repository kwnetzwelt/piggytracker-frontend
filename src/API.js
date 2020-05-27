import Config from './Config';

const API =class {
    static apiEndpoint = Config.apiEndpoint + Config.apiEndpointPrefixRoute;

    static getStoredAuthToken = () => {
      return localStorage.getItem('id_token');
    }
    static getAuthHeader = () => {
      return {'Authorization' : "Bearer " + this.getStoredAuthToken()};
    }


    static restoreAuthToken = () => {
      var authToken = localStorage.getItem("id_token");
      if(authToken)
      {
        return true;
      }
      return false;
    }
    static storeAuthToken = (token) =>
    {
      if(token)
        localStorage.setItem("id_token", token);
      else
        localStorage.removeItem("id_token");
    }

    static urlify =(value) => String(value).toLowerCase().replace(" ","-");
    static getCategoryUrl = (userId, category) => Config.staticAssets +"/uploads/" + userId + "-c-" + this.urlify(category);
    //static getRemuneratorUrl = (userId, fullName) => Config.staticAssets + "/uploads/" + userId + "-r-" + this.urlify(fullName);
    static getRemuneratorUrl = (userId, fullName) =>  Config.staticAssets + "/month/02.jpg";
    static getMonthImageUrl = (monthCategories) => Config.staticAssets + "/month/" + (monthCategories.month).toString().padStart(2,"0") + ".jpg";
    static getUserInitials = (fullname) => {
    
        var initials = fullname.split(' ');
        if(initials.length >= 2)
          return initials[0].charAt(0).toUpperCase() + initials[initials.length-1].charAt(0).toUpperCase();
        else
          return fullname.charAt(0).toUpperCase();
      }
}
export default API;