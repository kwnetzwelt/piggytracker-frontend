class CategoryAccount{
    /**
     * 
     * @param {string} categoryName name for this category
     * @param {number} initialValue initial account value for this category
     */
    constructor(categoryName,initialValue)
    {
        this.category = categoryName;
        this.value = initialValue;
    }
}
class MonthCategories {
    /**
     * 
     * @param {int} month the month this collection represents
     */
    constructor(month){
        this.month = month;
        this.totals = [];
    };

    addEntry (entry){
        var found = false;
        this.totals.forEach(element => {
            if(element.category === entry.category){
                element.value += entry.value;
                found = true;
            }
        });
        if(!found)
            this.totals.push(new CategoryAccount(entry.category,entry.value));
    }
}
class Accounts {
    constructor(){
        this.remuneratorSpendings = {};
        /**
         * @property {CategoryAccount[]}
         */
        this.categoryTotals = [];
        /**
         * @property {MonthCategories[]}
         */
        this.categoryMonths = [];

    }
    get spendings() {
        return this.remuneratorSpendings;
    }
    /**
     * @returns {CategoryAccount[]}
     */
    get categories() {
        return this.categoryTotals;
    }
    /**
     * @returns {MonthCategories[]}
     */
    get months(){
        return this.categoryMonths;
    }

    addEntry (entry) {
      var found = false;
      
        if(!this.remuneratorSpendings[entry.remunerator])
        this.remuneratorSpendings[entry.remunerator] = 0;
      this.remuneratorSpendings[entry.remunerator] += entry.value;
      

        found = false;
        this.categoryTotals.forEach(total =>{
            if(total.category == entry.category)
            {
                total.value += entry.value;
                found = true;
            }
        });
        if(!found){
            this.categoryTotals.push(new CategoryAccount(entry.category, entry.value));
        }

        found = false;
        
        var date = new Date(entry.date);
        var monthOfEntry=date.getYear() * 12 + date.getMonth(); 
        this.categoryMonths.forEach(categoryMonth =>{
            if(categoryMonth.month == monthOfEntry)
            {
                categoryMonth.addEntry(entry);
                found = true;
            }
        });
        if(!found){
            var mc = new MonthCategories(monthOfEntry);
            mc.addEntry(entry);
            this.categoryMonths.push(mc);
        }


    }  
}

export default Accounts;