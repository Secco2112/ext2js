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


	for(var i=0; i<max_size; i++){
		_filesystem.push(0);
	}


	for(var i=0; i<rows; i++){
		memory[i] = [];
	}

	for(var i=0; i<rows; i++){
		for(var j=0; j<cols; j++){
			memory[i][j] = {};
			memory[i][j].used = 0;
		}
	}
	

	function form_manipulation(){
		$("input[name=prop_directory]").on("change", function(){
			var isChecked = $(this).is(":checked");
			if(isChecked) {
				$("input[name=prop_size]").val("4096").attr("readonly", "true");
			} else {
				$("input[name=prop_size]").val("").removeAttr("readonly");
			}
		});
	}





	function save_data(){
		$("#alocate_data").on("click", function(e){
			var name = $("input[name=prop_name]").val(),
				is_directory = $("input[name=prop_directory]").is(":checked"),
				size = $("input[name=prop_size]").val(),
				today = new Date(Date.now()).toLocaleString().split(', ')[0];
			
			var column_to_insert = get_first_id_column_available();
			_filesystem[column_to_insert] = 1;
			var random_color = get_random_color();

			if(column_to_insert || column_to_insert==0) {

				var tamanho = parseInt(size) / 4096;

				
				for(var i=0; i<tamanho; i++) {
					var position = get_position_to_insert();

					memory[position.row][position.col].id = column_to_insert;
					memory[position.row][position.col].used = 1;
					memory[position.row][position.col].name = name;
					if(i==0){
						textSize(22);
						fill(random_color);
						if(position.row > 6) {
							position.row = 0;
							position.col++;
						}
						text(name, position.row*70, position.col*70, 70, 70);
					} else {
						rect(position.row*70, position.col*70, 70, 70);
					}
				}

				textSize(12);
				text("id: " + column_to_insert + "\nname:" + name, 0, column_to_insert*70, 70, 70);
			}
		});
	}

});

