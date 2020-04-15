/*This is a budget Controller which will be responsible
for adding new incomes and also for adding expenses and for 
all the calculations that are required to be done*/
let budgetController = (function() {

    //Function constructor for expenses
    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentages = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }


    //Function constructor for incomes
    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };   


    let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(array){
            sum += array.value;
        });
        data.totals[type] = sum;
    }

 

    //Declaring an object of arrays to store all the the expenses and incomes
    let data = {
        allItems: {
            exp:[],
            inc: []
        },
        totals: {
            exp:0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    
    //This object will make functions public of this IIFE function which need to be executed at the start of the application
    return {
        addItem: function(type,description, value){
            
            let newItem;
            let ID;
            //We want our ID to be unique and it will be the last number + 1 from ID Array
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } 
            else{
                ID = 0;
            }
          
            //create new item based on type which is 'exp' or 'inc'
            if(type === 'exp'){
                newItem = new Expense(ID,description, value)
            }
            else if(type === 'inc'){
                newItem = new Income(ID,description, value)
            }

            //Pushing data at the end of the array
            data.allItems[type].push(newItem);

            //Returning the new element
            return newItem;
        },


        //Function to delete an item from our data 
        deleteItem: function(type, id){

            let arrayOfIDs, indexOfItem;

            //Getting array of ID'S
            arrayOfIDs = data.allItems[type].map(function(current){
                return current.id;
            });

            //Getting index of item to be deleted
            indexOfItem = arrayOfIDs.indexOf(id);

            //Deleting the item using splice method if item exists
             if(indexOfItem !== -1){
                 data.allItems[type].splice(indexOfItem, 1);
             }

             
        },


        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');


            //calculate the budget : income-expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate percentage of income that we spent
            if(data.totals.inc > 0){
               data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            
        },

        //Function to calculate percentages
        calculatePercentages: function(){

            data.allItems.exp.forEach(function(currentVar){
                currentVar.calcPercentages(data.totals.inc); 
            })
        },

        getPercentages: function(){
            let allExpPercentages = data.allItems.exp.map(function(currentVar){
                return currentVar.getPercentage();
            });
            return allExpPercentages;
        },

        //This will return the budget 
        getBudget: function(){

            return{
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
        }


    };
})(); 




/*This is user interface controller which will be responsible
for all the updates in the user interface whenever someone adds
new income sources or expenses and also when a user deletes expenses
or  income sources*/
let UIController = (function() {

    //This object is declared because whenever we are going to change class names we don't need 
    //to change all of the name manually
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        classSelectInc: '.income__list',
        classSelectExp: '.expense__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        classSelectContainer: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    let formatNumber = function(num, type){
        let numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2)
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if(int.length > 3 && int.length < 6){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }
        else if(int.length > 5 && int.length < 8){
            int = int.substr(0, int.length - 5) + ',' + int.substr(int.length - 5, int.length - 5) + ',' + int.substr(int.length - 3, int.length);
        }
        return (type === 'exp' ? '-' : '+') + ' ' + int +'.' + dec;
    };


    let nodeListForEach = function(nodeList, callback){
        for(let i = 0; i < nodeList.length; i++){
            callback(nodeList[i], i);
        }
    };

    //This object is used to get input from UI
    return {
        getInput: function() {
            return{
                type : document.querySelector(DOMstrings.inputType).value, 
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addItemToUI: function(obj, type){
            var newHtml,replacedHtml,classSelect;
            // We need to create a Plaeholder Html

            if(type === 'inc') {
                classSelect = DOMstrings.classSelectInc;
                newHtml = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                classSelect = DOMstrings.classSelectExp;
                newHtml = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // Changing the placeholder to the data received

            replacedHtml = newHtml.replace('%id%', obj.id);
            replacedHtml = replacedHtml.replace('%description%',obj.description);
            replacedHtml = replacedHtml.replace('%value%',formatNumber(obj.value, type));

            // Adding the html in the UI
            document.querySelector(classSelect).insertAdjacentHTML('beforeend', replacedHtml);
        },


        //Deleting the item from UI
        deleteItemFromUI: function(selectorID){
            let selectElement = document.getElementById(selectorID);
            selectElement.parentNode.removeChild(selectElement);
        },

        
        //Clearing all input boxes
        clearInputFields: function (){
            let inputFields;
            let fieldsArray;
            
            inputFields = document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);
            
            fieldsArray = Array.prototype.slice.call(inputFields);
            
            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
        },

        //Function to display total budget, expenses and income on UI
        displayBudgetOnUI : function(object){

            let type;
            object.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(object.totalIncome, type);
            document.querySelector(DOMstrings.expensesLabel).textContent =formatNumber(object.totalExpenses, type);
            if(object.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = object.percentage+' %';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        //Function to display Percentages on UI
        displayPercentagesOnUI: function(percentages){
            let percentageFields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            nodeListForEach(percentageFields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index]+'%';
                }
                else{
                    current.textContent = '---';
                }
            });
        },

        //Function to display current month and year
        displayMonth: function(){
            let now = new Date();
            let months = ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let month = now.getMonth();
            let year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent =months[month] + ' ' + year;
        },

        //Function to control focus colors of our input boxes
        changedType: function(){
            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
            );

            nodeListForEach(fields, function(current){
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        }

    }; 

})();

let controller = (function(budgetController, UIController) {

    //In this function we'll handle our all event listeners
    let setupEventListeners = function() {
    //We are using UIController function of DOMstring 
    var DOM = UIController.getDOMstrings(); 
    //event to get input when add button is clicked
    document.querySelector(DOM.inputBtn).addEventListener('click', controlAddItem);
   
    //event to get input when enter button from keyboard is pressed
    document.addEventListener('keypress', function(event){
        //Setting the event to work if the the entered key is enter
        if(event.keyCode === 13 || event.which === 13){
            controlAddItem(); 
        } 
    });
    //adding event to delete an item from expenses or income
    document.querySelector(DOM.classSelectContainer).addEventListener('click', controlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType);
}

    let updatePercentages= function(){
        
        //Calculate percentages
        budgetController.calculatePercentages();
        
        //Get percentages from the budget controller
        let percentages = budgetController.getPercentages();

        //Updating  the new percentages on UI 
        UIController.displayPercentagesOnUI(percentages);
    }
   
    //To update budget
    let updateBudget = function(){
        
        //calculate budget
         budgetController.calculateBudget();
        
        //return the budget
        let budget = budgetController.getBudget();
 
        //Display the budget on UI
        UIController.displayBudgetOnUI(budget);

    };

    //This function holds all the functionality which we want to 
    //perform when add button is pressed 
    let controlAddItem = function() {

        //getting data from input fields
        let input = UIController.getInput();
       
        if(input.Description !=="" && !isNaN(input.value) && input.value > 0){
            //Adding item to the budget controller
            let newItem = budgetController.addItem(input.type, input.description, input.value) 

            //Adding item to UI
            UIController.addItemToUI(newItem, input.type);

            //Clear the input fields
            UIController.clearInputFields();

            //Updates the budget
            updateBudget();

            //Updating Percentages
            updatePercentages();
        }

    };

    let controlDeleteItem = function(event){
        let itemID, splitID, ID, type;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){

            //Splitting the ID of each container so we can have type of that container
            splitID = itemID.split('-');
            type = splitID[0];
            ID =parseInt(splitID[1]);

            //Delete the item from the data structure
            budgetController.deleteItem(type, ID);

            //Delete the item from the UI
            deleteItemFromUI(itemID);

            //Update and show the new totals
            updateBudget();

            //Update Percentages
            updatePercentages();
        }
    };



    //This object will hold the init function which will be called when our application runs
     return{
         init: function(){  
             UIController.displayMonth();      
             UIController.displayBudgetOnUI({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: '-1 %'
            });
             setupEventListeners();
         }
     }


})(budgetController,UIController);

controller.init();
