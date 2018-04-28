this.name = "Test Gamemode";
this.author = "@idiidk";
this.usesUI = true;

this.init = function () {
    const self = this;

    //Define a ui shorthand.
    const ui = this.api.UI;

    /**
     * Define three rows to hold UI items.
     * Rows have one parameter, if it`s true it will center it`s children.
    **/
    const row1 = new ui.Row();
    const row2 = new ui.Row();
    const row3 = new ui.Row(true);

    /**
     * Define all the ui items and add them to the rows.
     * 
     * Labels have two arguments, the text to be displayed and the size of the text (which html element to use.)
     * 
     * TextInputs also have two arguments, one for the label text and one for the size (following materialize`s grid system.)
     * 
     * Buttons have two arguments as well, one for the label text and the other is a click handler.
    */
    const label = new ui.Label("Wojow this is cool", "p");
    const textInput = new ui.TextInput("Test Input", "s12");
    const button = new ui.Button("What did I type again?", function () {
        self.api.sendMessage("kahoot-color-3", "This:", `${textInput.element.val()}`, 4000);
    });

    row1.add(label);
    row2.add(textInput);
    row3.add(button);

    /**
     * For more information about UI elements, please look at the serverUI.js file in the app folder.
    */
}