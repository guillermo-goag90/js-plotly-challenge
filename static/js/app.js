
var samples = "./samples.json";

var dataSet = d3.json(samples).then(function(data) {

    //var metadata = data.metadata
    //var names3 = metadata.map(entry => entry.id);
    //console.log(names3);
})    

// Select the "select" tag in HTML
var idSelect = d3.select("#selDataset");


dropDown()
function dropDown() {
    d3.json(samples).then(function(data) {
        // Save subjects IDs into a new variable
        var subjects = data.names;

        // Loop subjects array to create a drop down list 
        subjects.forEach(function(subject) {
            var option = idSelect.append("option");
            option
                .attr("value", subject)
                .text(subject)
        })
    })
}

// Event handler
var change = idSelect.on("change", optionChanged);

function optionChanged() {
    // Select the input value
    var input = idSelect.property("value")
    console.log(input)

    d3.json(samples).then(function(data) {
        
        // I. Extract information for bar chart
        //Extract samples data from json and filter subject ID
        var samples = data.samples;
        var results = samples.filter(subject => subject.id === input);
        
        // Pull raw data for charts
        var sampleValues = results[0]["sample_values"];
        var otuID = results[0]["otu_ids"];
        var otuLabels = results[0]["otu_labels"];
        
        // Data for bar chart
        var topSampleVal = sampleValues.slice(0, 10);
        var otuIdsLabel = otuID.map(id => `OTU ${id}`);
        buildBarchart(topSampleVal, otuIdsLabel);

        // Data for bubble chart
        buildBubblechart(otuID, sampleValues, otuLabels)

        var metadata = data.metadata
        //var test = "950"
        var demoInfo = metadata.filter(id => id.id.toString() === input)
        console.log(demoInfo); 
    })
}

function buildBarchart(topSampleVal, otuIdsLabel) {
    var trace1 = {
        x: topSampleVal,
        y: otuIdsLabel,
        type: "bar",
        orientation: "h",
        transforms: [{
            type: "sort",
            target: "x",
            order: "ascending"
        }]
    };
    var data = [trace1]
    Plotly.newPlot("bar", data);
}

function buildBubblechart(otuID, sampleValues, otuLabels) {
    var trace1 = {
        x: otuID,
        y: sampleValues,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        }
    }
    var data = [trace1]
    Plotly.newPlot("bubble", data);
}

