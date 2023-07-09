**Data Synthesis Language Docs**

*Part 1. Functions*

Functions are called using the following syntax, similar of that to bash:

**[function name] [parameter one] [parameter two] ...**

The only function that returns any value is called **getVar**, and it can be used in place of a value for any given function's parameter.

Available functions:

* **init** (0 parameters): initializes the neural net based on the **width** and **depth** variables that can be specified using **set**.
* **train** (0 parameters): trains the model using the **rounds** variable which controls how many rounds of training are preformed and the **data** variable (an array) which contains the desired training data.

* **output** (0 parameters): runs the model.
* **log** (1 parameter: **value**): logs **value**. **value** can be of any data type.
* **set** (2 parameters: **name** and **value**): updates an existing builtin variable (width, depth, rounds, calibration, round, or data) to contain **value**
* **mkvar** (2 parameters: **name** and **value**): creates a new variable with the name **name** and the value **value**.
* **setvar** (2 parameters: **name** and **value**): updates an existing user-defined variable with the name **name** changes its contents to **value**.
* **end** (0 parameters): ends the program.
* **>** (3 parameters: **a**, **b**, and **c**):  sets **a** to **+** if **b** > **c**. Otherwise, it sets **a** to **-**.
* **<** (3 parameters: **a**, **b**, and **c**):  sets **a** to **+** if **b** < **c**. Otherwise, it sets **a** to **-**.
* **=** (3 parameters: **a**, **b**, and **c**):  sets **a** to **+** if **b** = **c**. Otherwise, it sets **a** to **-**.
* **!** (1 parameter: **bool**):  sets **bool** to **+** if **bool** = **-**, or to **-** if **bool** = **+**

IMPORTANT: **>**, **<**, **=**, and **!** do not return values, and thus cannot be used in boolean expressions. They instead store their result in a variable. (More details on where the data is stored can be found in the above list.)

*Part 2: Data Types*

There are 4 types of data in DSL: numbers, strings, booleans, and arrays.

Array syntax:

**[element1, element2, element3, element4...]**

String syntax:

**exampleString**

Number syntax:

**exampleNumber**

Boolean syntax:

**+** represents **true**, **1**, etc. and **-** represents **false**, **0**, etc.

*Part 3: Builtin Variables*

Builtin variables, as you probably know from part 1, can be set using the **set** function. Here is a list of all builtin variables and what they control:

**width** (number): equal to the width of the neural net

**depth** (number): equal to the height of the neural net

**rounds** (number): the number of training rounds to perform while training

**round** (boolean): if **+**, rounds the result to the nearest integer.

**calibration** (number): a number multiplied by the result from the neural net (before final bias is applied)

**finalBias** (number): a number subtracted from the final result (after calibration is applied)

*Part 4: Control Flow*

The control flow in DSL can be implemented using the two keywords **if** and **while**. An if statement looks like this:

**if [boolean expression]**\
**[code]**\
**closeif**

If the boolean expression (either **+**, **-**, or **getvar [variableName]**) evaluates to **+**, the code inside the if statement (between **if** and **endif**) is executed. Otherwise, it is not and the if statement is skipped over.

While loops are similar. They look almost identical to the if statement, but execute the code over and over until the boolean expression evaluates to **-**. Like this:

**while [boolean expression]**\
**[code]**\
**closewhile**