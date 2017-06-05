declare var require: any;
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  TESTER: any
  ACTUAL: any
  NORM : any
  RMSE : any

  num_points: any
  LOCV_percent : any = 0.8;

  num_input_neurons: any
  num_hidden_neurons: any
  num_output_neurons : any
  column_headers: any;
  row_headers: any;
  data_matrix:any;
  networkObj: any;
  

  // max_sin_output = this.num_input_neurons;

  // start_range : any
  // end_range : any


  x_data : any
  y_data : any

  training_options: any;
parseMe(file) {
  var comp = this;
  Papa.parse(file, {
  	   dynamicTyping: true,
       header: false, 
      complete: function(results) {
          console.log("Finished:", results.data);
          comp.start(results.data);
      }
  });
}
start(sheet) {
  
  this.TESTER = document.getElementById('tester');
  this.ACTUAL = document.getElementById('actual');
  this.NORM = document.getElementById('norm');
  this.RMSE = document.getElementById('rmse');
  // var networkObj = this.trainData(this.x_data, this.y_data);
  // var y_predicted = this.getPredData(this.x_data, networkObj.network, this.y_data);

  
    this.column_headers = sheet[0].slice();
    this.row_headers = _.map(sheet, 
      (row) => {
        return row[0];
      });
    this.data_matrix = _.map(sheet.slice(1), 
      (row) => {
        return row.slice(1);
      });
      
    this.num_points = 100;
    this.x_data = _.map(this.data_matrix,
      (row) => {
        return row[1];
      }).slice(0,this.num_points);
      
    this.y_data = _.map(this.data_matrix,
      (row) => {
        return row[0];
      }).slice(0,this.num_points);
      
    // num_points = data_matrix.length;
    console.log(this)
    this.num_input_neurons = 1;
    this.num_hidden_neurons = 4;
    this.num_output_neurons = 1;

  this.training_options = {
    log: 10,
    error: 0.0000000001,
    iterations: 1000,
    rate: 0.3
  }
  
    let network, testing_rmse, training_x_data, testing_x_data, training_y_data, testing_y_data;
    ({network, testing_rmse, training_x_data, testing_x_data, training_y_data, testing_y_data} = this.trainData(this.x_data, this.y_data))
    console.log(({network, testing_rmse, training_x_data, testing_x_data, training_y_data, testing_y_data}));
  var y_predicted = this.getPredData(this.x_data, network, this.y_data);
  
  let testing_y_predicted = this.getPredData(testing_x_data, network, this.y_data);
  let training_y_predicted = this.getPredData(training_x_data, network, this.y_data);
  document.getElementById('rmse').innerHTML = "Testing data RMSE: " + testing_rmse;
   
  this.plot(training_y_data, training_y_predicted, 'Actual Y Output', 'Predicted Y Output', 'Training Data', this.TESTER);
  this.plot(testing_y_data, testing_y_predicted, 'Actual Y Output', 'Predicted Y Output', 'Testing Data', this.TESTER);
  this.plot(this.x_data, y_predicted, 'X Data', 'Predicted Y Output', null, this.ACTUAL);
  this.graphHisto(this.y_data, y_predicted, 'myDiv');
  
} 
  ngOnInit() {
    var input = <HTMLInputElement>(document.getElementsByTagName('input')[0]);
    
    input.onclick = function () {
        input.value = null;
    };
    
    var comp = this;
    input.onchange = function () {
        // alert(this.value);
        comp.parseMe(input.files[0]); 
        
    }; 
  }
  
trainData(x_data, y_data) {
  console.log(this.num_input_neurons, this.num_hidden_neurons, this.num_output_neurons)
  // var network = new neataptic.Architect.Perceptron(this.num_input_neurons, this.num_hidden_neurons, this.num_output_neurons);
  var network = new neataptic.Architect.Perceptron(1,4,1);
   
  const norm_x_data = this.norm(this.x_data);
  const norm_y_data = this.norm(this.y_data);
  // arayy of objects containing x=[1,2,..,10] and y=sin(x)
  const norm_data = _.map(_.range(this.num_points),
    (n) => {
      return {
        x: norm_x_data[n],
        y: norm_y_data[n]
      }
    }
  );
  
  let training_data = _.sample(norm_data, Math.floor(this.LOCV_percent * this.num_points));
  let testing_data = _.difference(norm_data, training_data);
  
  let norm_training_data = _.map(training_data, 
    (data_point) => {
      return {
        x: data_point.x,
        y: data_point.y
      }
    }
  );
  
  let norm_testing_data = _.map(testing_data, 
    (data_point) => {
      return {
        x: data_point.x,
        y: data_point.y
      }
    }
  );
  
  
  let feed_array = _.map(norm_training_data,
    (data_point) => {
      return {
        input: [data_point.x],
        output: [data_point.y]
      }
    }
  );
  
  network.train(feed_array, this.training_options);
  
  
  let training_x_data = _.map(training_data,
    (data_point) => {
      return data_point.x*(_.max(x_data)-_.min(x_data)) + _.min(x_data)
    });
  
  let testing_x_data = _.map(testing_data,
    (data_point) => {
      return data_point.x*(_.max(x_data)-_.min(x_data)) + _.min(x_data)
    });
  let training_y_data = _.map(training_data,
    (data_point) => {
      return data_point.y*(_.max(y_data)-_.min(y_data)) - _.min(y_data)
    });
    
    
  let testing_y_data = _.map(testing_data,
    (data_point) => {
      return data_point.y*(_.max(y_data)-_.min(y_data)) - _.min(y_data)
    });
  
  // var y_predicted = getPredData(x_data, network);
  let training_y_predicted = this.getPredData(training_x_data, network, y_data);
  let testing_y_predicted = this.getPredData(testing_x_data,network, y_data);
  
  var testing_rmse =  this.calcRMSE(testing_y_predicted,testing_y_data);
  
  return {network, testing_rmse, training_x_data, testing_x_data, training_y_data, testing_y_data};
}

norm(array) {
  let a = _.min(array);
  let b = _.max(array);
  let ra = 1;
  let rb = 0;
  return _.map(array,
    (p) => {
      return (((ra-rb) * (p - a)) / (b - a)) + rb;
    })
}

calcRMSE(arr1, arr2) {
  return jStat.meansqerr(_.map(_.range(arr1.length), 
    (i) => {
      return arr2[i] - arr1[i];
    })
  );
}

getPredData(input_data, network, output_data) {
  return _.map(input_data, 
    (x) => {
      var temp = network.activate([
        (x-_.min(input_data))/(_.max(input_data)-_.min(input_data))
      ])[0] 
      * (_.max(output_data)-_.min(output_data)) + _.min(output_data);
      // console.log(temp)
      return temp;
    }
  );
}

plot(x_data, y_data,xlabel,ylabel,name, HTML) {
  if (!xlabel)
    xlabel="X";
  if (!ylabel)
    ylabel="Y";
  let layout = {
    xaxis: {title: xlabel},
    yaxis: {title: ylabel},
    
    margin: { t: 0 }
  }
  Plotly.plot( HTML, [{
      x: x_data,
      y: y_data,
      mode: 'markers',
      type: 'scatter',
      name: name
    }], layout );
}

graphHisto(actual_Y, predicted_Y, htmlID) {
  var trace1 = {
    x: actual_Y,
    // y: y1,
    name: 'Actual Y Output',
    histnorm: "count", 
    marker: {
      color: "rgba(255, 100, 102, 0.7)", 
      line: {
        color:  "rgba(255, 100, 102, 1)", 
        width: 1
      }
    },  
    opacity: 0.5, 
    type: "histogram", 
    nbinsx: 20
  };
  var trace2 = {
    x: predicted_Y,
    // y: y2, 
    marker: {
              color: "rgba(100, 200, 102, 0.7)",
               line: {
            color:  "rgba(100, 200, 102, 1)", 
            width: 1
      } 
               }, 
    name: "Predicted Y Output", 
    opacity: 0.75, 
    type: "histogram",
    nbinsx: 20
  };
  var data = [trace1, trace2];
  var layout = {
    barmode: "overlay", 
    title: "Comparison of Actual and Predicted Output Distributions", 
    xaxis: {title: "Y Output Value"}, 
    yaxis: {title: "Count"}
  };
  Plotly.newPlot(htmlID, data, layout);
}


}

