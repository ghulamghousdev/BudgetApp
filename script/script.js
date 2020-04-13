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


    //Declaring an object of arrays to store all the the expenses and incomes
    let data = {
        allItems: {
            exp:[],
            inc: []
        },
        totals: {
            exp:0,
            inc: 0
        }
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

        testing: function(){
            console.log(data);
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
    let DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    //This object is used to get input from UI
    return {
        getInput: function() {
            return{
                type : document.querySelector(DOMstring.inputType).value, 
                description : document.querySelector(DOMstring.inputDescription).value,
                value : document.querySelector(DOMstring.inputValue).value
            };
        },

        getDOMstrings: function() {
            return DOMstring;
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
   

    //This function holds all the functionality which we want to 
    //perform when add button is pressed 
    let controlAddItem = function() {

        //getting data from input fields
        let input = UIController.getInput();

        //Adding item to the budget controller
        budgetController.addItem(input.type, input.description, input.value) 

    }


    //This object will hold the init function which will be called when our application runs
     return{
         init: function(){
             setupEventListeners();
         }
     }


})(budgetController,UIController);

controller.init();