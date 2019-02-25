// BUDGET CONTROLLER
const budgetCotroller = (function () { 


 })();




// UI CONTROLLER
const UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDesciption: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

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
    }


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

        //1. Get the filed input data
        var input = UIctrl.getInput();        
   
        //2. Add the item to the budget controller
   
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
  
 