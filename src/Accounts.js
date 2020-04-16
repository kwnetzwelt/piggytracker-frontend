export class CategoryAccount{
    /**
     * 
     * @param {string} categoryName name for this category
     * @param {number} initialValue initial account value for this category
     */
    constructor(categoryName,initialValue)
    {
        this.category = categoryName;
        this.value = initialValue;
        this.id = categoryName+""+new Date().getTime();
    }
}
export class MonthCategories {
    /**
     * 
     * @param {int} tid the month this collection represents
     */
    constructor(tid){
        this.tid = tid;
        this.month = this.tid % 12;
        this.totals = [];
        this.year = Math.floor(this.tid /12);
        this.percentMoney = 0;
        this.totalsSum = 0;
    };
    getValueInCategory(category)
    {
        let total = this.totals.find(e => e.category === category);
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
        this.totalsSum += entry.value;
    };
    timePast() {
        const d = new Date();
        if(this.year < d.getFullYear())
        return 1;
        if(this.month < d.getMonth())
        return 1;
        if(this.month == d.getMonth())
        {
        return (d.getUTCDate() / parseFloat(d.monthDays()));
        }
        return 0;
    }

}


export class Target {
    constructor(obj){
        this._id = obj._id ? obj._id : undefined;
        this.totals = [];
        
        this.setTotals(obj.totals ? obj.totals : []);

        this.tid = parseInt(obj.tid ? obj.tid : 0);
        /**
         * @readonly
         */
        this.month = obj.tid % 12;
        /**
         * @readonly
         */
        this.year = Math.floor(obj.tid / 12);

    }
    setTotals (newTotals){
        var t = [];
        for (let index = 0; index < newTotals.length; index++) {
            let cleanedUp = {
                value:parseFloat(newTotals[index].value),
                category:newTotals[index].category
            }
            t.push(cleanedUp);
        }
        this.totals = t;
    }
}

export class Accounts {
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
        
        this.allCategories = [];
        this.allRemunerators = [];

    }
    getTargetStatus(tid, category,comparingValue){
        let value = this.getTargetValue(tid,category);
        return value <= comparingValue ? "CRIT" : "OK";
    }
    /**
     * 
     * @param {Number} month 
     * @param {String} category 
     */
    getTargetValue(tid, category) {
        for (let index = 0; index < this.targets.length; index++) {
            const element = this.targets[index];
            if(element.tid === tid){
                
                var target = element.totals.find((e) => e.category === category);
                if(target){
                    return target.value ?? 0;
                }
            
                return 0;
            }
        }
        return 0;
    }
    getTargetValueMonth(catMonth){
        for (let index = 0; index < this.targets.length; index++) {
            const element = this.targets[index];
            if(element.tid === catMonth.tid){
                var sum = 0;
                catMonth.totals.forEach((ce) =>{
                    var target = element.totals.find((e) => e.category === ce.category);
                    sum += target.value;
                });
                console.log(sum);
                return sum;
            }
        }
        return 0;
    }
    get categories() {
        return this.allCategories;
    }
    get remunerators() {
        return this.allRemunerators;
    }
    get spendings() {
        return this.remuneratorSpendings;
    }
    /**
     * @returns {MonthCategories[]}
     */
    get months(){
        return this.categoryMonths;
    }
    
    //const updatedTargetData = accountValues.setTargets(monthTargetsObject.tid,catMonthTargets);
    setTargets(tid, catMonthTargets) {
        console.log("set targets ");
        console.log(catMonthTargets);
        var targetIndex = this.targets.findIndex((e) => e.tid === tid);
        if(targetIndex !== -1)
        {
            this.targets[targetIndex].setTotals(catMonthTargets);
            return this.targets[targetIndex];
        }else
        {
            var newTarget = new Target({tid:tid, totals:[...catMonthTargets]});
            this.targets.push(newTarget);
            return newTarget;

        }
    }
    getTargetForEditing (tid) {
        var target = this.targets.find((e) => e.tid === tid);
        var targetToEdit = {tid:tid,totals:[]};

        if(target)
            targetToEdit = target;
        
        // ensure all categories are present
        for (let index = 0; index < this.categoryTotals.length; index++) {
            const element = this.categoryTotals[index];
            const hasValueForCategory = targetToEdit.totals.find((e) => e.category === element.category);
            if(!hasValueForCategory)
            {
                targetToEdit.totals.push({category: element.category, value:0});
            }
        }
        return new Target(targetToEdit);
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
        var tidOfEntry=date.getFullYear() * 12 + date.getMonth(); 
        this.categoryMonths.forEach(categoryMonth =>{
            if(categoryMonth.tid === tidOfEntry)
            {
                categoryMonth.addEntry(entry);
                found = true;
            }
        });
        if(!found){
            var mc = new MonthCategories(tidOfEntry);
            mc.addEntry(entry);
            this.categoryMonths.push(mc);
            this.categoryMonths.sort((m1,m2) => m1.tid > m2.tid ? 1 : -1);
        }

        if(this.allRemunerators.indexOf(entry.remunerator) === -1)
        {
            this.allRemunerators.push(entry.remunerator);
        }
        if(entry.category && this.allCategories.indexOf(entry.category) === -1)
        {
            this.allCategories.push(entry.category);
        }
    }  
}
