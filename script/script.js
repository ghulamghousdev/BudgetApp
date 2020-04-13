/*This is a budget Controller which will be responsible
for adding new incomes and also for adding expenses and for 
all the calculations that are required to be done*/
let budgetController = (function() {

    //Function constructor for expenses
    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };


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

        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget : income-expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate percentage of income that we spent

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
        classSelectExp: '.expense__list'
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
                newHtml = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                classSelect = DOMstrings.classSelectExp;
                newHtml = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // Changing the placeholder to the data received

            replacedHtml = newHtml.replace('%id%', obj.id);
            replacedHtml = replacedHtml.replace('%description%',obj.description);
            replacedHtml = replacedHtml.replace('%value%',obj.value);

            // Adding the html in the UI
            document.querySelector(classSelect).insertAdjacentHTML('beforeend', replacedHtml);
        },

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
    })
}
   
    //To update budget
    let updateBudget = function(){
        
        //calculate budget
         
        
        //return the budget


        //Display the budget on UI


    };

    //This function holds all the functionality which we want to 
    //perform when add button is pressed 
    let controlAddItem = function() {

        //getting data from input fields
        let input = UIController.getInput();
       
        if(inputDescription !=="" && !isNaN(input.value) && input.value > 0){
            //Adding item to the budget controller
            let newItem = budgetController.addItem(input.type, input.description, input.value) 

            //Adding item to UI
            UIController.addItemToUI(newItem, input.type);

            //Clear the input fields
            UIController.clearInputFields();

            //Updates the budget
            updateBudget();
        }

    };


    //This object will hold the init function which will be called when our application runs
     return{
         init: function(){
             setupEventListeners();
         }
     }


})(budgetController,UIController);

controller.init();
