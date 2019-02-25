// BUDGET CONTROLLER
const budgetCotroller = (function () { 

    var Expense = function(id, description, value) { 
        this.id = id;
        this.description = description;
        this.value = value;
     };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {

 
            addItem: function (type, des, val) { 
            var newItem, ID; 
            // Create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else {
                ID = 0;
            }

            //Create a new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new elemnt 
            return newItem;
         },

            testing: function () {
            console.log(data);
            
        }

    };


 })();









// UI CONTROLLER
const UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDesciption: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function () { 
            return {
                 type : document.querySelector(DOMstrings.inputType).value, // inc or exp
                 description : document.querySelector(DOMstrings.inputDesciption).value,
                 value : document.querySelector(DOMstrings.inputValue).value
            };
         },

         getDOMstrings: function() { 
             return DOMstrings;
          }
    };


})();




// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UIctrl) { 
    var setupEventListeners = function() {
        var DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };




    const ctrlAddItem = function () { 
        var input, newItem;
        //1. Get the filed input data
        input = UIctrl.getInput();        
   
        //2. Add the item to the budget controller
        newItem = budgetCotroller.addItem(input.type, input.description, input.value);

        //3. Add the item to the UI
   
        // 4. Calculate Budget
   
        // 5. Display the budget on the UI 

        
     }

     return {
         init: function() {
             console.log("App Started");
             setupEventListeners();
         }
     }

})(budgetCotroller, UIController);

controller.init();
  
 