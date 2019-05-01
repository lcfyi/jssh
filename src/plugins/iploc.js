var iploc = {
    description: "gets the geolocation of a particular IP",
    help: [
        "Usage",
        "",
        ""
    ],
    function(e) {
        let ip = e.split(" ")[1];
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://json.geoiplookup.io/" + ip, false);
        xhr.send();
        let response = JSON.parse(xhr.responseText);
        this.parent.terminal.writeln(response.city);
    }
};

export default iploc;