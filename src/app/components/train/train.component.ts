import { Component, OnInit } from '@angular/core';
import { NeatapticService } from '../../services/neataptic/neataptic.service';
 
@Component({
  selector: 'app-train',
  templateUrl: 'train.component.html',
})
export class TrainComponent implements OnInit {
  config = {
     LOCV_percent : 0.8,
     num_points : 100,
     num_input_neurons : 10,
     num_hidden_neurons : 14,
     num_output_neurons : 1,
     training_options : {
      log: 10,
      error: 0.0000000001,
      iterations: 1000,
      rate: 0.3
    }
  } 
  file: any;
  constructor(private neatapticService: NeatapticService) {  }

  ngOnInit() {
    
    var input = <HTMLInputElement>(document.getElementById('file'));

    input.onclick = function() {
      input.value = null;
    };

    var comp = this;
    input.onchange = function() {
      comp.file = input.files[0];
    };}
  
  
  train() {
    this.neatapticService.parseAndTrain(this.file, this.config);
  }
}