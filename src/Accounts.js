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
        this.year = Math.floor(this.month /12);
        this.actualMonth = this.month % 12;
        this.percentMoney = 0;

    };
    getValueInCategory(category)
    {
        let total = this.totals.find(e => e.category == category);
        if(total)
            return total.value;
        return 0;
    }
    
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
    };
}


class Target {
    constructor(obj){
        
        this.category = obj.category;
        this.month = obj.month;
        this.tid = obj.tid;
        this.value = obj.value;
    }
}

class Accounts {
    constructor(targets){
        /**
         * @property {Target[]}
         */
        this.targets = [];
        if(targets)
        {
            for (let index = 0; index < targets.length; index++) {
                const element = targets[index];
                this.targets.push(new Target(element));
            }
        }

        this.remuneratorSpendings = {};
        /**
         * @property {CategoryAccount[]}
         */
        this.categoryTotals = [];
        /**
         * @property {MonthCategories []}
         */
        this.categoryMonths = [];

    }
    /**
     * 
     * @param {Number} month 
     * @param {String} category 
     */
    getTargetValue(month, category) {
        for (let index = 0; index < this.targets.length; index++) {
            const element = this.targets[index];
            if(element.month === month && element.category === category)
                return element.value;
        }
        return 0;
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
    getTargetsForEditing (month) {
        var catMonth = this.categoryMonths.find((e) => e.month == month);
        var categories = [];
        for (let index = 0; index < this.categories.length; index++) {
            const element = this.categories[index];
            const ca = new CategoryAccount(element.category, catMonth.getValueInCategory(element.category));
            categories.push(ca);
        }
        return categories;
    }
    addEntry (entry) {
      var found = false;
      
        if(!this.remuneratorSpendings[entry.remunerator])
        this.remuneratorSpendings[entry.remunerator] = 0;
      this.remuneratorSpendings[entry.remunerator] += entry.value;
      

        found = false;
        this.categoryTotals.forEach(total =>{
            if(total.category === entry.category)
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
        var monthOfEntry=date.getFullYear() * 12 + date.getMonth(); 
        this.categoryMonths.forEach(categoryMonth =>{
            if(categoryMonth.month === monthOfEntry)
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