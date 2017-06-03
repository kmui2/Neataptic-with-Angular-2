declare var require: any;
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  TESTER = document.getElementById('tester');
  ACTUAL = document.getElementById('actual');
  NORM = document.getElementById('norm');
  RMSE = document.getElementById('rmse');

  num_points = 100;
  LOCV_percent = 0.8;

  num_input_neurons = 1;
  num_hidden_neurons = 4;
  num_output_neurons = 1;

  max_sin_output = this.num_input_neurons;

  start_range = 0;
  end_range = 2*Math.PI;


  x_data = _.range(this.start_range, this.end_range, (this.end_range - this.start_range)/this.num_points);

  y_data = _.map(this.x_data,
    (n) => {
      return Math.sin(n);
    }
  );

  training_options = {
    log: 10,
    error: 0.0000000001,
    iterations: 1000,
    rate: 0.3
  }

  ngOnInit() {
    
    let TESTER = document.getElementById('tester');
    let ACTUAL = document.getElementById('actual');
    let NORM = document.getElementById('norm');
    let RMSE = document.getElementById('rmse');
    var networkObj = this.trainData(this.x_data, this.y_data);
    var y_predicted = this.getPredData(this.x_data, networkObj.network, this.y_data);

    document.getElementById('rmse').innerHTML = "Testing data RMSE: " + networkObj.testing_rmse;
    
    // console.log("This is the tester id: " + tester); 
    this.plot(this.y_data, y_predicted, 'Actual Y Output', 'Predicted Y Output', TESTER);
    this.plot(this.x_data, y_predicted, 'X Data', 'Predicted Y Output', ACTUAL);

  }
  
trainData(x_data, y_data) {
  var network = new neataptic.Architect.Perceptron(this.num_input_neurons, this.num_hidden_neurons, this.num_output_neurons);
  
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
    
    
  let testing_y_data = _.map(testing_data,
    (data_point) => {
      return data_point.y*(_.max(y_data)-_.min(y_data)) - _.min(y_data)
    });
  
  // var y_predicted = getPredData(x_data, network);
  let training_y_predicted = this.getPredData(training_x_data, network, y_data);
  let testing_y_predicted = this.getPredData(testing_x_data,network, y_data);
  
  var testing_rmse =  this.calcRMSE(testing_y_predicted,testing_y_data);
  
  return {network, testing_rmse, training_x_data, testing_x_data};
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

plot(x_data, y_data,xlabel,ylabel,HTML) {
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
      y: y_data}], layout );
}


}

