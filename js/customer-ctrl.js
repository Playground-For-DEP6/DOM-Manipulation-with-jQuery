/*
    MIT License

    Copyright (c) 2020 Dhanusha Perera

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */

/**
 * @author : Dhanusha Perera
 * @since : 17/11/2020
 **/

/*===============================================================================
 * Global Variables
 *===============================================================================*/


// customer related variables
var customers = [];
var newCustomerObject;
var selectedCustomer;

// form related elements
var txtIdElement;
var txtNameElement;
var txtAddressElement;

//form button
var btnSave;
var btnClear;

// form related values are stored using these variables
var txtIdValue;
var txtNameValue;
var txtAddressValue;

//table related elements
var tblCustomersElement;
var tBodyElement;
var selectedTableRowElement;
var tblCustomersDataTable; // datatable
var btnRemove;

// pagination related variables
var pageSize = -1;
var pageCount = 1;
var startPageIndex = 0;
var endPageIndex = -1;
var MAX_PAGES = 3;

/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init() {
    txtIdElement = $("#txt-id");
    txtNameElement = $("#txt-name");
    txtAddressElement = $("#txt-address");

    btnSave = $("#btn-save");
    btnClear = $("#btn-clear");

    tblCustomersElement = $("#tbl-customers");
    tBodyElement = $("#tbl-customers>tbody");

    // tblCustomersDataTable = $('#tbl-customers').DataTable();
    btnRemove = $('trash');

    txtIdElement.focus();

    // display all the customers in the list
    displayAllCustomers();
}

/* Datatable */
$(document).ready(function() {
    tblCustomersDataTable = $('#tbl-customers').DataTable({
        "paging":   true,
        "ordering": true,
        "info":     false,
        "pageLength": 5,
    });
});

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

// Bind an event handler to btn save
btnSave.click(insertCustomer);

// Bind an event handler to btn clear
btnClear.click(clearFormFields);

/*===============================================================================
 * Functions
 *===============================================================================*/

/* Constructor function */
function Customer(id, name, address) {
    this.__id = id;
    this.__name = name;
    this.__address = address;

    // this.printDetails = function () {
    //     console.log(this.id, this.name, this.address);
    // }
}

// getters and setters
Customer.prototype.setId = function (id) {
    this.__id = id;
};

Customer.prototype.getId = function () {
    return this.__id;
};

Customer.prototype.setName = function (name) {
    this.__name = name;
};

Customer.prototype.getName = function () {
    return this.__name;
};

Customer.prototype.setAddress = function (address) {
    this.__address = address;
};

Customer.prototype.getAddress = function () {
    return this.__address;
};

// print customer details function
Customer.prototype.printDetails = function () {
    console.log("Customer details: " + this.__id, this.__name, this.__address);
};

// sample data for testing purposes
// var c1 = new Customer(1, "Dhanusha", "Kelaniya");
// var c2 = new Customer(2, "Buddhika", "Colombo");
// var c3 = new Customer(3, "Sandaruwan", "Kiribathgoda");
// var c4 = new Customer(4, "Perera", "Gampaha");
//
// // make the customer list using an array
// customers.push(c1, c2, c3, c4);

// // print all customers for testing purposes
// for (var i = 0; i < customers.length; i++) {
//     customers[i].printDetails();
// }

function insertCustomer() {
    // alert("insert customer works!");

    // if customer is selected by the user then, btn save should act as update button
    if (selectedCustomer) {
        // selectedCustomer == null ---> condition becomes false
        // here, update operation should be happened
        if (validate(false)) {
            // isInsertion false
            /* validation is passed */
            updateCustomer();
        }
    } else {
        // insert a new customer is happening here
        if (validate(true)) {
            // isInsertion true
            /* validation is passed */

            // create new customer object
            newCustomerObject = createNewCustomerObject();

            // add new customer object to the customers list
            customers.push(newCustomerObject);
            displayAllCustomers();
            clearFormFields();

            // prompt an successful message - insert successful
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Insert successful!",
                showConfirmButton: false,
                timer: 1000,
            });
        } else {
            //validation failed
            return;
        }
    }
}

function updateCustomer() {
    var customerIndex = customers.findIndex(function (c) {
        return c.getId() == selectedCustomer.getId();
    });

    if (customerIndex != -1) {
        /* Customer object is in the customers array. */
        // update the customer details
        customers[customerIndex].setId(txtIdValue);
        customers[customerIndex].setName(txtNameValue);
        customers[customerIndex].setAddress(txtAddressValue);

        // prompt an successful message - update successful
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Update successful!",
            showConfirmButton: false,
            timer: 1000,
        });

        if (selectedTableRowElement) {
            selectedTableRowElement.children("td:nth-child(1)").text(txtIdValue);
            selectedTableRowElement.children("td:nth-child(2)").text(txtNameValue);
            selectedTableRowElement.children("td:nth-child(3)").text(txtAddressValue);
        }
    } else {
        // prompt an error - update failed
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong when updating customer details!",
            // footer: '<a href>Why do I have this issue?</a>'
        });
    }
}

function getUserInputFromAllFormFields() {
    // get user input values from the form
    txtIdValue = txtIdElement.val().trim();
    txtNameValue = txtNameElement.val().trim();
    txtAddressValue = txtAddressElement.val().trim();
}

function createNewCustomerObject() {
    return new Customer(txtIdValue, txtNameValue, txtAddressValue);
}

function validate(isInsertion) {
    var regExp = null;
    var validated = true;

    getUserInputFromAllFormFields();

    // remove error indication from the UI
    txtIdElement.removeClass("is-invalid");
    txtNameElement.removeClass("is-invalid");
    txtAddressElement.removeClass("is-invalid");

    // input fields validation process
    if (txtAddressValue.length < 3) {
        txtAddressElement.addClass("is-invalid");
        txtAddressElement.select();
        validated = false;
    }

    regExp = /^[A-Za-z][A-Za-z .]{3,}$/;
    if (!regExp.test(txtNameValue)) {
        txtNameElement.addClass("is-invalid");
        txtNameElement.select();
        validated = false;
    }

    regExp = /^C\d{3}$/;
    if (!regExp.test(txtIdValue)) {
        txtIdElement.addClass("is-invalid");
        $("#helper-txt-id").removeClass("text-muted");
        $("#helper-txt-id").addClass("invalid-feedback");
        txtIdElement.select();
        validated = false;
    }

    if (isInsertion) {
        /* Let's find whether duplicate ids are there */
        if (
            customers.findIndex(function (c) {
                return c.getId() === txtIdValue;
            }) !== -1
        ) {
            alert("Duplicate Customer IDs are not allowed");
            txtIdElement.addClass("is-invalid");
            $("#helper-txt-id").removeClass("text-muted");
            $("#helper-txt-id").addClass("invalid-feedback");
            txtIdElement.select();
            validated = false;
        }
    }

    return validated;
}

function clearFormFields() {
    /* Clear all the input fields */
    txtIdElement.val("");
    txtNameElement.val("");
    txtAddressElement.val("");

    /* Set selected customer to null */
    selectedCustomer = null;

    /* Set selected customer table row element to null */
    selectedTableRowElement = null;

    /* Remove selected-styles from all table rows */
    // removeAllSelectedRecordStyle();

    txtIdElement.prop("disabled", false); //Enable customer id input field
}


function clearTable() {
    // clear the table
    // tblCustomersDataTable = $('#tbl-customers').DataTable({
    //     "paging": true,
    //     "ordering": true,
    //     "info": false,
    // });
    tblCustomersDataTable.destroy();

}

/* Display all customers */
function displayAllCustomers() {

    // clearTable();

    // remove all the table rows if exists
    for (var i = 0; i < $("#tbl-customers>tbody").children().length; i++) {
        $("#tbl-customers>tbody").children().remove();
    }

    if (customers.length > 0) {

        for (var i = 0; i < customers.length; i++) {

            // make the table row
            var tblRowElm = '         <tr>\n' +
                '                        <td>' + customers[i].getId() + '</td>\n' +
                '                        <td>' + customers[i].getName() + '</td>\n' +
                '                        <td>' + customers[i].getAddress() + '</td>\n' +
                '                        <td><img class="trash" src="./img/trash.png" alt="trash-icon"></td>\n' +
                '                    </tr>';


            // append the table row to the tbody
            tBodyElement.append(tblRowElm);
        }

        /* Attach the click event for the trash button */
        $("#tbl-customers>tbody").find("img").click(function (event) {

            // remove that particular element from the table
            $(this).parents("tr").remove();

            var cusId = $($(this).parents("tr").children()[0]).text();
            var index = customers.findIndex(function (c) {
                return c.getId() == cusId;
            });

            // for testing purposes
            console.log('index is: ' + index);

            // delete the customer from the customer array
            customers.splice(index, 1);

            // for testing purposes
            console.log("customer list: " + customers);
            event.stopPropagation();

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Deleted successfully!',
                showConfirmButton: false,
                timer: 1000
            });
        });


        /* catch the selected table row and  display in the form field */
        $("#tbl-customers>tbody").find("tr").click(function (event) {

            /* remove the highlighted-style from all the table rows  */
            // removeAllSelectedRecordStyle();

            // selected recorded is styled here
            $(this).css("background-color", "rgb(252, 186, 4)");
            // $(this).addClass('active').siblings().removeClass('active');

            selectedTableRowElement = $(this);

            // create a new customer object using selected table row data
            // selectedCustomer is taken into consideration to handle btn save button operations
            selectedCustomer = new Customer(
                $(this).children("td:nth-child(1)").text(), // id is fetched from here
                $(this).children("td:nth-child(2)").text(), // name is fetched from here
                $(this).children("td:nth-child(3)").text()  // address is fetched from here
            );

            if (selectedCustomer) {
                txtIdElement.prop("disabled", true); //Disable
            }

            // set values to the form fields
            txtIdElement.val(selectedCustomer.getId());
            txtNameElement.val(selectedCustomer.getName());
            txtAddressElement.val(selectedCustomer.getAddress());

            // stop bubbling the event handler to parent DOM elements
            event.stopPropagation();
        });

    }

}

// var c1 = new Customer(1, "Dhanusha", "Kelaniya");
// addARowToTable(new Customer(1, "Dhanusha", "Kelaniya"));

// add a row
// function addARowToTable(cus) {
//     // make the table row
//     var tblRowElm =
//         '<img class="trash" src="./img/trash.png" alt="trash-icon">';
//
//     // append the table row to the tbody
//     // clearTable();
//     tblCustomersDataTable.row.add([cus.getId().toString(), cus.getName(), cus.getAddress(), tblRowElm]).draw();
//
//     //btnRemove.click(removeRow());
//
// }


// function removeRow() {
//     tblCustomersDataTable
//         .row($(this).parents('tr'))
//         .remove()
//         .draw();
//
//     // clearTable();
// }


// pagination part

// $(document).ready( function () {
//   $('#tbl-customers').DataTable( {
//     "paging":   true,
//     "ordering": true,
//     "info":     false,
// } );
// } );
