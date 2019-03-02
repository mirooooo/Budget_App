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

    const calculateTotal = (type) => {
        var sum = 0;
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

         deleteItem(type, id) {
            var ids, index;
            ids =  data.allItems[type].map((current) => current.id );

            index = ids.indexOf(id);

            if (index !== -1) {
              data.allItems[type].splice(index, 1);
            }            
         },

         calculateBudget: function() { 

            // calculate total income and expenses 
            calculateTotal('inc');
            calculateTotal('exp');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;


            // calculate the % of income that we spent 
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

          },

          getBudget() {
              return {
                   budget: data.budget,
                   totalInc: data.totals.inc,
                   totalExp: data.totals.exp,
                   persentage: data.percentage
              }
          },



            testing: function () {
            console.log(data);
        },
    };
 })();









// UI CONTROLLER
const UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDesciption: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

    };

    return {
        getInput: function () { 
            return {
                 type : document.querySelector(DOMstrings.inputType).value, // inc or exp
                 description : document.querySelector(DOMstrings.inputDesciption).value,
                 value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
         },

         addListItem: function (obj, type) { 
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id ="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class = "item__value">%value%</div><div class = "item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp')  {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix" ><div class = "item__value" >%value%</div><div class="item__percentage"> 21 %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button ></div></div></div>';
            }
 

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          },

          clearFields: function () { 
              var fields, fieldsArr;
              fields = document.querySelectorAll(DOMstrings.inputDesciption + ', ' + DOMstrings.inputValue);

             fieldsArr = Array.prototype.slice.call(fields);

             fieldsArr.forEach(current => {
                 current.value = "";
             });

             fieldsArr[0].focus();
           },

           displayBudget(obj) {
               document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
               document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
               document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
               if (obj.persentage > 0) {
                 document.querySelector(DOMstrings.percentageLabel).textContent = obj.persentage + '%';
               } else {
                 document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };


    const updateBudget = () => {
        
        // 1. Calculate Budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
       UIctrl.displayBudget(budget);
        
    };



    const ctrlAddItem = function () { 
        var input, newItem;
        //1. Get the filed input data
        input = UIctrl.getInput();        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCotroller.addItem(input.type, input.description, input.value);
    
            //3. Add the item to the UI
            UIctrl.addListItem(newItem, input.type);
    
            // 4. Clear the Fields
            UIController.clearFields();
    
            // 5. Calculate and update budget
            updateBudget();            
        }

     };

     const ctrlDeleteItem = (event) => {
       var itemID, splitID, type, ID;
       
       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

       if (itemID) {
         
          //inc-1
          splitID = itemID.split('-');
          type = splitID[0];
          ID = parseInt(splitID[1]);

          // 1. delete the item from the data structure
        budgetCotroller.deleteItem(type, ID);

          // 2. Deleta the item from UI


          // 3. Update and show the new budget 
       }
     }

     return {
         init: function() {
             console.log("App Started");
             UIctrl.displayBudget({
                  budget: 0,
                   totalInc: 0,
                   totalExp: 0,
                   persentage: -1
             });
             setupEventListeners();
         }
     }

})(budgetCotroller, UIController);

controller.init();
  
 