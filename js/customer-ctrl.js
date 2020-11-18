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




/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init() {
    txtIdElement = $('#txt-id');
    txtNameElement = $('#txt-name');
    txtAddressElement = $('#txt-address');

    btnSave = $("#btn-save");
    btnClear = $("#btn-clear");

    tblCustomersElement = $('#tbl-customers');
    tBodyElement = $('#tbl-customers>tbody');

    txtIdElement.focus();

    // display all the customers in the list
    displayAllCustomers();
}

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
}

Customer.prototype.getId = function () {
    return this.__id;
}

Customer.prototype.setName = function (name) {
    this.__name = name;
}

Customer.prototype.getName = function () {
    return this.__name;
}

Customer.prototype.setAddress = function (address) {
    this.__address = address;
}

Customer.prototype.getAddress = function () {
    return this.__address;
}

// print customer details function
Customer.prototype.printDetails = function () {
    console.log('Customer details: ' + this.__id, this.__name, this.__address);
}


// sample data for testing purposes
var c1 = new Customer(1, "Dhanusha", "Kelaniya");
var c2 = new Customer(2, "Buddhika", "Colombo");
var c3 = new Customer(3, "Sandaruwan", "Kiribathgoda");
var c4 = new Customer(4, "Perera", "Gampaha");

// make the customer list using an array
customers.push(c1, c2, c3, c4);

// // print all customers for testing purposes
// for (var i = 0; i < customers.length; i++) {
//     customers[i].printDetails();
// }


function insertCustomer() {

    // alert("insert customer works!");

    if(validate()){
        /* validation is passed */

        // create new customer object
        newCustomerObject = createNewCustomerObject();

        // add new customer object to the customers list
        customers.push(newCustomerObject);
        displayAllCustomers();
        clearFormFields();

    } else {
        //validation failed
        return;
    }
}

function updateCustomer() {

}

function deleteCustomer(id) {

}


function getUserInputFromAllFormFields() {
    // get user input values from the form
    txtIdValue = txtIdElement.val().trim();
    txtNameValue = txtNameElement.val().trim();
    txtAddressValue = txtAddressElement.val().trim();
}


function createNewCustomerObject() {
    return new Customer(txtIdValue,txtNameValue,txtAddressValue);
}

function validate() {
    var regExp = null;
    var validated = true;

    getUserInputFromAllFormFields();

    // remove error indication from the UI
    txtIdElement.removeClass('is-invalid');
    txtNameElement.removeClass('is-invalid');
    txtAddressElement.removeClass('is-invalid');


    // input fields validation process
    if (txtAddressValue.length < 3) {
        txtAddressElement.addClass('is-invalid');
        txtAddressElement.select();
        validated = false;
    }

    regExp = /^[A-Za-z][A-Za-z .]{3,}$/;
    if (!regExp.test(txtNameValue)) {
        txtNameElement.addClass('is-invalid');
        txtNameElement.select();
        validated = false;
    }

    regExp = /^C\d{3}$/;
    if (!regExp.test(txtIdValue)) {
        txtIdElement.addClass('is-invalid');
        $('#helper-txt-id').removeClass('text-muted');
        $('#helper-txt-id').addClass('invalid-feedback');
        txtIdElement.select();
        validated = false;
    }

    /* Let's find whether duplicate ids are there */
    if (customers.findIndex(function (c) {
        return c.getId() === txtIdValue;
    }) !== -1) {
        alert("Duplicate Customer IDs are not allowed");
        txtIdElement.addClass('is-invalid');
        $('#helper-txt-id').removeClass('text-muted');
        $('#helper-txt-id').addClass('invalid-feedback');
        txtIdElement.select();
        validated = false;
    }

    return validated;
}


function clearFormFields() {
    txtIdElement.val('');
    txtNameElement.val('');
    txtAddressElement.val('');
}

function displayAllCustomers() {

    // remove all the table rows if exists
    for (var i = 0; i < $("#tbl-customers>tbody").children().length; i++) {
        $("#tbl-customers>tbody").children().remove();
    }

    if (customers.length > 0) {

        // remove the tfoot
        $("#tbl-customers>tfoot").remove();

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

        $("#tbl-customers>tbody").find("img").click(function (event) {

            // remove that particular element from the table
            $(this).parents("tr").remove();

            var cusId = $($(this).parents("tr").children()[0]).text();
            var index = customers.findIndex(function (c) {
                return c.getId() ==  cusId;
            });

            // for testing purposes
            console.log('index is: ' + index);

            // delete the customer from the customer array
            customers.splice(index,1);

            // for testing purposes
            console.log("customer list: " + customers);
            event.stopPropagation();
        });

        // console.log("------------------");
        // console.log();

        $("#tbl-customers>tbody").find("tr").click(function (event) {
            // console.log('this row : ' + $(this));
            // console.log($(this));
            // console.log($(this).children("td"));
            txtIdElement.val($(this).children("td:nth-child(1)").text());
            txtNameElement.val($(this).children("td:nth-child(2)").text());
            txtAddressElement.val($(this).children("td:nth-child(3)").text());
            event.stopPropagation();
        })
    } else {
        // add the tfoot
        $("#tbl-customers>tfoot").add();
    }

}

// $("pagination>page-item")



