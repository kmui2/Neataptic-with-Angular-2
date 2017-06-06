import { Injectable } from '@angular/core';

@Injectable()
export class NeatapticService {
  LOCV_percent: number;
  num_points: number;
  num_input_neurons: number;
  num_hidden_neurons: number;
  num_output_neurons: number;
  training_options :any;
  
  constructor() {  }
  
    parseAndTrain(file, config) {
      var service = this;
      Papa.parse(file, {
    	   dynamicTyping: true,
        header: false,
        complete: function(results) {
          console.log("Finished:", results.data);
          service.start(results.data);
        }
      });
      this.LOCV_percent = config.LOCV_percent;
      this.num_points = config.num_points;
      this.num_input_neurons = config.num_input_neurons;
      this.num_hidden_neurons = config.num_hidden_neurons;
      this.num_output_neurons = config.num_output_neurons;
      this.training_options = config.training_options;
    }
    createNormOrigDataMatrix(data_matrix) {
      var col_datas = this.transpose(data_matrix);
      var norm_orig_cols = _.map(col_datas,
        (col_data) => {
          return _.map(col_data,
            (p) => {
              return {
                norm: this.normPoint(p, col_data),
                orig: p
              };
            });
        });
  
      return this.transpose(norm_orig_cols);
  
    }
  
    normPoint(p, target_array) {
      return (p - _.min(target_array)) / (_.max(target_array) - _.min(target_array));
    }
  
    transpose(matrix) {
      var result = [];
      for (let i = 0; i < matrix[0].length; i++) {
        result.push(_.map(matrix,
          (row) => {
            return row[i];
          }));
      }
      return result;
    }
  
    start(sheet) {
  
  
      var sheet = sheet.slice(0, this.num_points + 1);
      // const column_headers = sheet[0].slice();
      // const row_headers = _.map(sheet, 
      //   (row) => {
      //     return row[0];
      //   }).slice();
      var data_matrix = _.map(sheet.slice(1),
        (row) => {
          return row.slice(1);
        });
      var norm_orig_data_matrix = this.createNormOrigDataMatrix(data_matrix);
      var x_datas = _.map(norm_orig_data_matrix,
        (row) => {
          return row.slice(1);
        });
      var y_data = _.map(norm_orig_data_matrix,
        (row) => {
          return row[0];
        });
  
  
      var network = new neataptic.Architect.Perceptron(this.num_input_neurons, this.num_hidden_neurons, this.num_output_neurons);
      var testing_rmse, training_y_predicted, orig_testing_y_data, orig_training_y_data, testing_y_predicted, y_predicted;
      ({
        network,
        testing_rmse,
        training_y_predicted,
        orig_testing_y_data,
        orig_training_y_data,
        testing_y_predicted,
        y_predicted
      } = this.customCV(x_datas, y_data, network, this.LOCV_percent, this.training_options));
  
      document.getElementById('rmse').innerHTML = "Testing data RMSE: " + testing_rmse;
      this.plot(orig_training_y_data, training_y_predicted, 'Actual Y Output', 'Predicted Y Output', 'Training Data', document.getElementById('tester'));
      this.plot(orig_testing_y_data, testing_y_predicted, 'Actual Y Output', 'Predicted Y Output', 'Testing Data', document.getElementById('tester'));
      var orig_y_data = _.map(y_data,
        (y) => {
          return y.orig;
        });
      this.graphHisto(orig_y_data, y_predicted, 'myDiv');
    }
  
  
    getPredDatas(input_data, network, output_data) {
      return _.map(input_data,
        (x_row_datas) => {
          var temp = network.activate(x_row_datas)[0] *
            (_.max(output_data) - _.min(output_data)) + _.min(output_data);
          return temp;
        }
      );
    }
  
  
    customCV(x_datas, y_data, network, LOCV_percent, training_options) {
      // arayy of objects containing x=[1,2,..,10] and y=sin(x)
      const data = _.map(_.range(x_datas.length),
        (n) => {
          return {
            x: x_datas[n],
            y: y_data[n]
          }
        }
      );
  
      let training_data = _.sample(data, Math.floor(LOCV_percent * x_datas.length));
      let testing_data = _.difference(data, training_data);
  
      var feed_array = _.map(training_data,
        (row) => {
          return {
            input: _.map(row.x,
              (x) => {
                return x.norm;
              }),
            output: [row.y.norm]
          }
        })
  
      network.train(feed_array, training_options);
  
      var norm_x_data = _.map(x_datas,
        (row) => {
          return _.map(row,
            (x) => {
              return x.norm;
            });
        });
  
      var norm_training_x_data = _.map(training_data,
        (row) => {
          return _.map(row.x,
            (x) => {
              return x.norm;
            });
        });
  
      var norm_testing_x_data = _.map(testing_data,
        (row) => {
          return _.map(row.x,
            (x) => {
              return x.norm;
            });
        });
  
      var orig_y_data = _.map(y_data,
        (y) => {
          return y.orig;
        });
  
      let y_predicted = this.getPredDatas(norm_x_data, network, orig_y_data);
      let training_y_predicted = this.getPredDatas(norm_training_x_data, network, orig_y_data);
      let testing_y_predicted = this.getPredDatas(norm_testing_x_data, network, orig_y_data);
  
      var orig_training_y_data = _.map(training_data,
        (row) => {
          return row.y.orig;
        });
  
      var orig_testing_y_data = _.map(testing_data,
        (row) => {
          return row.y.orig;
        });
  
      var testing_rmse = this.calcRMSE(testing_y_predicted, orig_testing_y_data);
  
      return { network, testing_rmse, training_y_predicted, orig_testing_y_data, orig_training_y_data, testing_y_predicted, y_predicted };
    }
  
  
    norm(array) {
      let a = _.min(array);
      let b = _.max(array);
      let ra = 1;
      let rb = 0;
      return _.map(array,
        (p) => {
          return (((ra - rb) * (p - a)) / (b - a)) + rb;
        })
    }
  
    calcRMSE(arr1, arr2) {
      return jStat.meansqerr(_.map(_.range(arr1.length),
        (i) => {
          return arr2[i] - arr1[i];
        })
      );
    }
  
    plot(x_data, y_data, xlabel, ylabel, name, HTML) {
      if (!xlabel)
        xlabel = "X";
      if (!ylabel)
        ylabel = "Y";
      let layout = {
        xaxis: { title: xlabel },
        yaxis: { title: ylabel },
  
        margin: { t: 0 }
      }
      Plotly.plot(HTML, [{
        x: x_data,
        y: y_data,
        mode: 'markers',
        type: 'scatter',
        name: name
      }], layout);
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
            color: "rgba(255, 100, 102, 1)",
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
            color: "rgba(100, 200, 102, 1)",
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
        xaxis: { title: "Y Output Value" },
        yaxis: { title: "Count" }
      };
      Plotly.newPlot(htmlID, data, layout);
    }
  

}