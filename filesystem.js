var	cols = 17,
	rows = 7,
	colors = [],
	_filesystem = [],
	max_size = rows,
	total_places;

var memory = [];



function setup() {
	createCanvas(1200, 500);

  	background(255, 255, 255);

  	for (var i = 0; i < cols; i++) {
    	for (var j = 0; j < rows; j++) {
      		var x = i * 70;
      		var y = j * 70;
      		fill("#fff");
      		stroke(0);
      		rect(x, y, 70, 70);
    	}
  	}
}


$(document).ready(function(){
	var id = 0,
		block_size = 4096;


	form_manipulation();
	save_data();
	find_data();


	// Monta e alimenta objeto do filesystem
	for(var i=0; i<max_size; i++){
		_filesystem[i] = {};
		_filesystem[i].used = 0;
	}


	// Monta e alimenta objeto da memória
	for(var i=0; i<cols; i++){
		memory[i] = [];
	}

	for(var i=0; i<cols; i++){
		for(var j=0; j<rows; j++){
			memory[i][j] = {};
			memory[i][j].used = 0;
		}
	}
	

	function form_manipulation() {
		$("input[name=prop_directory]").on("change", function(){
			var isChecked = $(this).is(":checked");
			if(isChecked) {
				$("input[name=prop_size]").val("4096").attr("readonly", "true");
			} else {
				$("input[name=prop_size]").val("").removeAttr("readonly");
			}
		});
	}





	function save_data() {
		$("#alocate_data").on("click", function(e){
			var name = $("input[name=prop_name]").val(),
				is_directory = $("input[name=prop_directory]").is(":checked"),
				size = $("input[name=prop_size]").val(),
				today = new Date(Date.now()).toLocaleString().split(', ')[0];

			if(name && size) {
				var column_to_insert = get_first_id_column_available();
				_filesystem[column_to_insert].used = 1;
				_filesystem[column_to_insert].id = column_to_insert;
				_filesystem[column_to_insert].name = name;

				var random_color = get_random_color();
				_filesystem[column_to_insert].color = random_color;

			
				if(column_to_insert || column_to_insert==0) {

					var tamanho = parseInt(size) / 4096;

					
					for(var i=0; i<tamanho; i++) {
						var position = get_random_position_to_insert();

						// get_random_position_to_insert();

						memory[position.row][position.col].id = column_to_insert;
						memory[position.row][position.col].used = 1;
						memory[position.row][position.col].name = name;
						memory[position.row][position.col].size = size;
						memory[position.row][position.col].block_count = tamanho;
						memory[position.row][position.col].position = {row: position.col, col: position.row};
						memory[position.row][position.col].color = random_color;
						if(i==0){
							textSize(20);
							fill(random_color);
							text(name, position.row*70, position.col*70, 70, 70);

							memory[position.row][position.col].info = 1;
						} else {
							rect(position.row*70, position.col*70, 70, 70);

							memory[position.row][position.col].info = 0;
						}
					}

					textSize(12);
					text("id: " + column_to_insert + "\nname: " + name, 0, column_to_insert*70, 70, 70);
				}
			}
		});
	}


	function find_data() {
 		$("#find_data").on("click", function(e){
 			var id = $("#findId").val();

 			if(id){
 				if(check_id_exists(id)) {
 					var blocks = get_blocks_with_id(id);

 					var filesystem_data = blocks.filesystem[0];

 					// Limpa o bloco
 					fill(255, 255, 255);
 					rect(0, filesystem_data.id*70, 70, 70);


 					// Aplica borda no filesystem
 					strokeWeight(4);
 					stroke('#222222');
 					fill(filesystem_data.color);
 					textSize(12);
 					text("id: " + filesystem_data.id + "\nname: " + filesystem_data.name, 0, filesystem_data.id*70, 70, 70);
 					
 				} else {
 					alert("O arquivo não foi encontrado.");
 				}
 			}
 		});
	}

});


(function() {
  	'use strict';
  	window.addEventListener('load', function() {
    	var forms = document.getElementsByClassName('needs-validation');
    	
    	var validation = Array.prototype.filter.call(forms, function(form) {
      		form.addEventListener('submit', function(event) {
        		if (form.checkValidity() === false) {
          			event.preventDefault();
          			event.stopPropagation();
        		}
        		form.classList.add('was-validated');
      		}, false);
		});
  	}, false);
})();

