// Save dataset file location in variable
var samples = "./samples.json";

// HTML selectors
var idSelect = d3.select("#selDataset");

// Build function to extract and filter data necessary to create Dashboard
function inputDashboard(sampleId) {
    d3.json(samples).then(function(data) {
        
        // I. Extract information for bar chart
        //Extract samples data from json and filter subject ID
        var samples = data.samples;
        var results = samples.filter(subject => subject.id === sampleId);
        
        // Pull raw data for charts
        var sampleValues = results[0]["sample_values"];
        var otuID = results[0]["otu_ids"];
        var otuLabels = results[0]["otu_labels"];
        
        // Data for bar chart
        var topSampleVal = sampleValues.slice(0, 10);
        var otuIdsLabel = otuID.map(id => `OTU ${id}`);
        buildBarchart(topSampleVal, otuIdsLabel, otuLabels);

        // Data for bubble chart
        buildBubblechart(otuID, sampleValues, otuLabels)

        var metadata = data.metadata
        var demoInfo = metadata.filter(id => id.id.toString() === sampleId)
        demoInfo = demoInfo[0]
        //console.log(demoInfo)
        demographicInfo(demoInfo); 
    })
}

// Event handler
var change = idSelect.on("change", optionChanged);

// Call inputDashboard and render grapsh when a new input is passed
function optionChanged() {
    var input = idSelect.property("value")
    inputDashboard(input)
}

function buildBarchart(topSampleVal, otuIdsLabel, otuLabels) {
    var trace1 = {
        x: topSampleVal,
        y: otuIdsLabel,
        text: otuLabels,
        type: "bar",
        orientation: "h",
        transforms: [{
            type: "sort",
            target: "x",
            order: "ascending"
        }]
    };
    var layout = {
        title: "Top 10 Bacteria",
        margin: { t: 35, l: 100 }
    };
  
    var data = [trace1]
    Plotly.newPlot("bar", data, layout);
}

function buildBubblechart(otuID, sampleValues, otuLabels) {
    var trace1 = {
        x: otuID,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: otuID,
            colorscale: "YlGnBuc"
        }
    }
    var layout = {
        title: "Bacteria Found in Sample",
        margin: { t: 10 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 35}
      };
  
    var data = [trace1]
    Plotly.newPlot("bubble", data, layout);
}

function demographicInfo(demoInfo) {
    // Select panel body
    var panelBody = d3.select(".panel-body")

    // Clean previous data
    panelBody.selectAll("div").remove();
    
    // Obtain key value pairs and append to panel tag
    Object.entries(demoInfo).forEach(([key,value]) => {
        panelBody.append("div").text(`${key}: ${value}`, "strong");
    })
}

// Create and call init() function to set up initial dashboard
function init() {
    d3.json(samples).then(function(data) {
        var subjects = data.names;
        console.log(subjects)
        
        subjects.forEach(subject => {
            var option = idSelect.append("option");
            option
                .attr("value", subject)
                .text(subject)
        })
        var initSubject = subjects[0];
        inputDashboard(initSubject)
    })    
};
init();