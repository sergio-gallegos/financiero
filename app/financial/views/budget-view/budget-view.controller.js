import helper from '../../resources/services/helpers';
import TransactionServices from '../../resources/services/transaction-service';

class BudgetViewController {
    constructor($timeout, $scope, $rootScope) {
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.helper = helper;

        // Transaction globals
        this.transactionEdit = false;
        this.transactionTemp = {
            description: "",
            value: "",
            update: "",
            idcurrency: 0,
            idwallet: 0,
            idcategory: 0,
            idplan: null,
            isbudget: false,
            ispaied: false,
        }
        this.transactionSelected = [];
    }

    // # Transaction actions 
    updateTransactionSource() {
        this.isLoading = true;
        TransactionServices.getAll((d) => {
            this.rootScope.data.transactions = d;
            this.isLoading = false; 
            this.scope.$apply();
        });
    }

    createTransaction() {
        TransactionServices.create(this.transactionTemp, (d) => {
            helper.cleanObject(this.transactionTemp);
            this.updateTransactionSource();
        });
    }

    removeTransaction() {
        if(this.transactionSelected.length == 1) {
            TransactionServices.delete(this.transactionSelected[0], (d) => { 
                this.transactionSelected = []
                this.updateTransactionSource(); 
            });
        } else if(this.transactionSelected.length > 1) {
            TransactionServices.deleteBatch(this.transactionSelected, (d) => { 
                this.transactionSelected = []
                this.updateTransactionSource(); 
            });
        }
    }
    

    toogleSelect(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(item);
        }
    }

    exists(item, list) {
        return list.indexOf(item) > -1;
    };
}

BudgetViewController.$inject = ['$timeout', '$scope', '$rootScope'];

export default BudgetViewController;