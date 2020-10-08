
var samples = "./samples.json";


var dataSet = d3.json(samples).then(function(data) {

    //console.log(data);
    //var names = data.names;
    //console.log(names)

    //var metadata = data.metadata
    //var names3 = metadata.map(entry => entry.id);
    //console.log(names3);

    // var subjectID = "950";
    // var samples = data.samples;


    
    // var otuID = results[0]["otu_ids"]
    // var sampleValues = results[0]["sample_values"];
    // console.log(otuID)
    // console.log(sampleValues)
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
        
        // Data for bar chart
        var sampleValues = results[0]["sample_values"];
        sampleValues = sampleValues.slice(0, 10)

        var otuID = results[0]["otu_ids"];
        otuID = otuID.map(id => `OTU ${id}`);
        buildBarchart(sampleValues, otuID)
    })
}

function buildBarchart(sampleValues, otuID) {
    var trace1 = [{
        x: sampleValues,
        y: otuID,
        type: "bar",
        orientation: "h",
        transforms: [{
            type: "sort",
            target: "x",
            order: "ascending"
        }]
    }];
    Plotly.newPlot("bar", trace1);
}

// function buildBarchart(change) {
//     d3.json(samples).then(function(data) {

//         //Extract samples data from json
//         var samples = data.samples;

//         // Filter by subject or individual
//         var results = samples.filter(subject => subject.id === input);

//         // Pull data for chart
//         var sampleValues = results[0]["sample_values"];
//         var otuID = results[0]["otu_ids"];
//         console.log(sampleValues);
//         console.log(otuID);

//     })
// }
