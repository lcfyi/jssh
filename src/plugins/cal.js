function generateCalString(date) {
    let startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let numDays =  32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    let daysIndex = startOfMonth + numDays;
    let stringOut = "";

    for (let i = 0; i < daysIndex; i++) {
        if (i >= startOfMonth) {
            let date = i - startOfMonth + 1;
            if (date < 10) stringOut = stringOut + `  ${date} `; 
            else stringOut = stringOut + ` ${date} `; 
    
            if (i % 7 == 6) stringOut = stringOut + "\n";
        } else stringOut = stringOut + "    ";
    }

    return stringOut;
}

var cal = {
    description: "prints the calendar of the current month",
    help: [
        "This function prints the calendar of the current month. You may",
        "optionally add arguments for the month and year. If you leave the",
        "year argument blank, this function will assume the current year for",
        "the requested month",
        " ",
        "cal [month] [year]",
        "Note: Month value must be between 1-12 inclusive. Year can be any",
        "4 digit number representing any Gregorian calendar value",
        "",
        "Examples",
        "cal",
        "cal 6",
        "cal 4 2018"
    ],
    function(e) {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        
        const dayLine = "Sun Mon Tue Wed Thu Fri Sat";

        
        let string = e.replace(/\s\s+/g, ' ').trim();
        let parse = string.split(" ");
        let warning = "";
        try {
            if (parse.length > 3) {
                throw new Error("Too many arguments! Please see the function's usage with cal help")
            } else if (parse.length > 1) {
                if (isNaN(parse[1])) {
                    throw new Error("Not a valid number for month!");
                } else if (parse[1] < 1 || parse[1] > 12) {
                    throw new Error("Invalid month requested");
                }
                    
                if (parse.length == 2) {
                    var year = new Date().getFullYear().toString();
                    warning = "No valid year entered, assuming it is " + year + "\n";
                } else if (isNaN(parse[2])) {
                    throw new Error("Not a valid number for year!");
                } else if (parse[2] < 0) {
                    throw new Error("Invalid year requested - cannot be negative");
                } else {
                    var year = parseInt(parse[2]).toString();
                }

                var monthName = monthNames[parseInt(parse[1]) - 1];
                var date = new Date (year, parseInt(parse[1]) - 1); 
            } else {
                var date = new Date();
                var monthName = monthNames[date.getMonth()];
                var year = date.getFullYear();
                warning = "Printing for current month and year" + "\n";
            }

            this.parent.terminal.writeln(warning + "\n");
            
            let monthLine = "         " + monthName + " " + year + "         ";
            this.parent.terminal.writeln(monthLine);
            this.parent.terminal.writeln(dayLine);
            this.parent.terminal.writeln(generateCalString(date));
        } catch(error) {
            var val = "cal: " + error.message;
            this.parent.terminal.writeln(val);
        }
    }
};

export default cal;