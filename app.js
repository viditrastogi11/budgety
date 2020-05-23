var budgetController=(function(){

    var Expense=function(id,descrip,value){
        this.id=id;
        this.description=descrip
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
          this.percentage=Math.round(this.value/totalIncome*100)  
        }
        
    };
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    }
    var Income=function(id,descrip,value){
        this.id=id;
        this.description=descrip
        this.value=value;
    };


    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(current){
            sum=sum+current.value;
        });
        data.totals[type]=sum;
    };
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
     totals:{
         exp:0,
         inc:0
     },
     budget:0,
     percentage:-1,
    };
    return{

        addItems: function(type,des,val){
               var newItem,ID;
               // create new id
               if(data.allItems[type].length>0)
               {
                ID =data.allItems[type][data.allItems[type].length-1].id +1

               }
               else{
                ID =0;               
               }
              
               //create new item based on 'inc, or 'exp'
               if(type==='exp'){
               newItem=new Expense(ID,des,val);

               }
               else if(type==='inc'){
               newItem=new Income(ID,des,val);

               }
               data.allItems[type].push(newItem)
               return newItem;

        },
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        calculateBudget:function(){
            calculateTotal('exp');
            calculateTotal('inc')
            data.budget=data.totals.inc-data.totals.exp
            if(data.totals.inc>0)
            {
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100)
            }else{
                data.percentage=-1;
            }
           
        },
        testing:function(){
            console.log(data)
        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            }
        },
        calculatePercentage:function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            })
        },
        getPercentage:function(){
            var allperc= data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allperc;
        },
    }

})();









var UIController =(function(){
    var DOMstring={
        inputType:'.add__type',
        inputDescript:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list'  ,
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensePercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    }
    var formatNumber=function(num,type){
        var numSplit;
         num=Math.abs(num);
         num=num.toFixed(2);
         numSplit=num.split('.')
         int = numSplit[0];
         if(int.length>3){
             var temp=int.length%3;
         for(var i=0;i<(int.length/3)-1;i++){
             if(temp!==0){

                 int=int.substr(0,temp)+','+int.substr(temp,int.length-temp)
                 temp=temp+4
             }
             else if(int.length===6){
                int=int.substr(0,3)+','+int.substr(3,6)
                break
             }
             else{
                temp=temp+3
             }
                
            
            }
         }
        
         dec =numSplit[1];

        return   (type ==='exp'?'-':'+')+' '+int+'.'+dec;

    }
    var nodeListForEach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
          
      };
    
    return{
        getInput:function(){
            return{
            type:document.querySelector(DOMstring.inputType).value,//inc or exp
            description: document.querySelector(DOMstring.inputDescript).value,
            value:parseFloat(document.querySelector(DOMstring.inputValue).value),
            }
        },
        getDOMstring:function(){
            return DOMstring;
        },
        
        addListItem: function(obj,type){
           
            var html,newHTML,element;
            if(type==='inc'){
                element=DOMstring.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
        
            else if(type==='exp'){
                element=DOMstring.expenseContainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHTML=html.replace('%id%',obj.id)
            newHTML=newHTML.replace('%description%',obj.description)
            newHTML=newHTML.replace('%value%',formatNumber(obj.value,type))

            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML)
            
        
        },
        deleteListItem:function(selectorID){
            var el= document.getElementById(selectorID)
           el.parentNode.removeChild(el)

        },
        clearField:function(){
           var fields= document.querySelectorAll(DOMstring.inputDescript+','+DOMstring.inputValue)
            var fieldsArr=Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current,index,array){
                current.value='';
            
            });
            fieldsArr[0].focus();
        },
        displayBudget:function(obj){
            obj.budget>0?type='inc':type='exp'
            document.querySelector(DOMstring.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstring.incomeLabel).textContent=obj.totalInc;
            document.querySelector(DOMstring.expenseLabel).textContent=obj.totalExp;
            document.querySelector(DOMstring.percentageLabel).textContent=obj.percentage;
            if(obj.percentage>0){
                document.querySelector(DOMstring.percentageLabel).textContent=obj.percentage+'%';
            
            }
            else{
            document.querySelector(DOMstring.percentageLabel).textContent='----';

            }
        },
        changeType:function(){
            var fields =document.querySelectorAll(DOMstring.inputType + ','+DOMstring.inputDescript+','+DOMstring.inputValue)
        
        nodeListForEach(fields,function(cur){
            cur.classList.toggle('red-focus');
        });
        document.querySelector(DOMstring.inputBtn).classList.toggle('red');
        },




        displayPercentages:function(percentages){
        var fields=document.querySelectorAll(DOMstring.expensePercLabel)
        

      
        
        nodeListForEach(fields,function(current,index){
         
         
         if(percentages[index]>0){
            current.textContent=percentages[index]+'%';
         }
         else{
            current.textContent='--'
         }
            
        })
        },
        
        displayMonth:function(){
            var now,year,month;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          
            now =new Date();
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(DOMstring.dateLabel).textContent=months[month]+'  '+ year;

        }
     

    }
})();

















var controller =(function(budgetCtrl,UICtrl){

    var setupEventListener=function(){
        var DOM=UICtrl.getDOMstring(); 

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem();
            }
    
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType)
    }
    var updateBudget=function(){
        // calculate budget
        budgetCtrl.calculateBudget();
        // return the budget
        var budget =budgetCtrl.getBudget();
        //display the budgetn
        UICtrl.displayBudget(budget);
    }
    var updatePercentages=function(){
        //calculate percent
        budgetCtrl.calculatePercentage();
        //read % from bdgtctrl
        var percentages=budgetCtrl.getPercentage();
        //update ui
        UICtrl.displayPercentages(percentages);
    }
    var ctrlAddItem= function(){
       
        var input,newItem
         // get input data
        input = UICtrl.getInput();
        //add item to budget controller
        if(input.description!=='' && !isNaN(input.value)&& input.value>0){
        newItem= budgetCtrl.addItems(input.type,input.description,input.value)
        //add the item to the ui
        UICtrl.addListItem(newItem,input.type)
        // clear the fields
        UICtrl.clearField();
        // calculate the budget & display the budget on the ui
        updateBudget();
        // calculate and update %
        updatePercentages();
       
        };
       
    }
    var ctrlDeleteItem=function(event){
        var itemId,splitID,type,ID;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
            splitID = itemId.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
           
            //delete from ds
            budgetCtrl.deleteItem(type,ID);
            //delete from UI
            UICtrl.deleteListItem(itemId)
            //update and show
            updateBudget();
        }
    }
    
    return {
        init:function(){
             console.log("fffff");
             UICtrl.displayMonth();
             UICtrl.displayBudget({ 
                 budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1,

             });
            setupEventListener();
        }
    }

})(budgetController,UIController);

controller.init();