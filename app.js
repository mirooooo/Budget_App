// BUDGET CONTROLLER
const budgetCotroller = (function () { 

    var Expense = function(id, description, value) { 
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
     };

 
     Expense.prototype.calcPercentage = (totalIncome) => {
        if (totalIncome > 0) {
          this.percentage = Math.round((this.value / totalIncome) * 100 );
        } else {
          this.percentage = -1;
        }
     };

     Expense.prototype.getPercentage = () => {
       return this.percentage;
     }

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

          calculatePercentages() {
            data.allItems.exp.forEach((cur) => {
              cur.calcPercentage(data.totals.inc);  
            });
          },
          getPercentages() {
            var allPerc = data.allItems.exp.map((cur) => {
              return  cur.getPercentage();
            });
            return allPerc;
            // console.log(allPerc);
            
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };  

     var formatNumber = (num, type) =>{
        var numSplit, int, dec;
        // + or - before the num
        // exactly 2 decimal points

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' +  dec;

      };

        var nodeListForEach = function (list, callback) {
          for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
          }
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          },




          deleteListItem(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

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
             var type;
               obj.budget > 0 ? type = 'inc' : type = 'exp';

               document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
               document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
               document.querySelector(DOMstrings.expensesLabel).textContent =formatNumber(obj.totalExp, 'exp');
               if (obj.persentage > 0) {
                 document.querySelector(DOMstrings.percentageLabel).textContent = obj.persentage + '%';
               } else {
                 document.querySelector(DOMstrings.percentageLabel).textContent = '---';
               };
           },



           displayPercentages(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

             nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0) {
                  current.textContent = percentages[index] + '%';
                }else {
                  current.textContent = '---';
                  
                }
             });


           },

           displayMonth() {
             var now, year, month, months;
             now = new Date();

            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' +  year;
           },

           changeType() {

             var fields = document.querySelectorAll(
               DOMstrings.inputType + ',' + 
               DOMstrings.inputDesciption + ',' + 
               DOMstrings.inputValue);
             
               nodeListForEach(fields, (cur) => {
                 cur.classList.toggle('red-focus');
               });

               document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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

        document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changeType);
    };


    const updateBudget = () => {
        
        // 1. Calculate Budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
       UIctrl.displayBudget(budget);
    };

    const updatePercentages = () => {

      // 1. Calculate Percentages
      budgetCtrl.calculatePercentages();


      // 2. Read percentages from budget controller
      var percentages = budgetCtrl.getPercentages();

      // 3. Update the UI with the new percentages
      UIctrl.displayPercentages(percentages);
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

            // 6. Calculate and update percentages
            updatePercentages();
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
        UIctrl.deleteListItem(itemID);

          // 3. Update and show the new budget 
          updateBudget();

           // 6. Calculate and update percentages
           updatePercentages();
       }
     }

     return {
         init: function() {
             console.log("App Started");
             UIctrl.displayMonth();  
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
  
 