var	cols = 17,
	rows = 7,
	colors = [],
	_filesystem = [],
	max_size = 112,
	used_places = 0;

var memory = [];

var last_position, position;


var FLAG_MOSTRA_ALOCACAO = true,
	FLAG_MOSTRA_ACESSO = true,
	FLAG_MOSTRA_EXCLUSAO = true;



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


	// form_manipulation();
	save_data();
	find_data();
	delete_data();


	// Alimenta informações do sistema
	var system_total_size = max_size * block_size;
	$("#total_size").find('big').html(system_total_size.format(0, ".", ".") + " bytes");
	$("#total_size").find('small').html('(' + system_total_size.bytes_to_size() + ')');

	$("#used_size").find('big').html("0 bytes");
	$("#used_size").find('small').html('(0 B)');

	$("#free_size").find('big').html(system_total_size.format(0, ".", ".") + " bytes");
	$("#free_size").find('small').html('(' + system_total_size.bytes_to_size() + ')');

	$(function(){
	  	$("#pieChart").drawPieChart([
	  		{ title: "Espaço livre", value : 100, color: "#969696" },
	    	{ title: "Espaço usado", value : 0, color: "#2C3E50" }
	  	]);
	});


	// Monta e alimenta objeto do filesystem
	for(var i=0; i<rows; i++){
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
			$(".file-info").hide();

			var name = $("input[name=prop_name]").val(),
				is_directory = $("input[name=prop_directory]").is(":checked"),
				size = $("input[name=prop_size]").val(),
				today = new Date(Date.now()).toLocaleString().split(', ')[0];

			if(name && size) {
				var column_to_insert = get_first_id_column_available();

				if(column_to_insert || column_to_insert==0) {
					var tamanho = Math.ceil(parseInt(size) / block_size);

					if(used_places + tamanho <= max_size) {
						used_places += tamanho;

						_filesystem[column_to_insert].used = 1;
						_filesystem[column_to_insert].column = column_to_insert;
						_filesystem[column_to_insert].id = id;
						_filesystem[column_to_insert].name = name;

						var random_color = get_random_color();
						_filesystem[column_to_insert].color = random_color;
						

						for(var i=0; i<tamanho; i++) {
							if(i==0) {
								//var position = get_random_position_to_insert();
								// if(id == 0) {
								// 	position = {row: 1, col: 0};
								// } else {
								// 	position = get_next_position_to_insert(last_position);
								// 	while(memory[position.row][position.col].used == 1) {
								// 		position = get_next_position_to_insert(position);
								// 	}
								// }
								position = {row: 1, col: 0};
								while(memory[position.row][position.col].used == 1) {
									position = get_next_position_to_insert(position);
								}
								last_position = position;

								memory[position.row][position.col].id = id;
								memory[position.row][position.col].used = 1;
								memory[position.row][position.col].name = name;
								memory[position.row][position.col].size = size;
								memory[position.row][position.col].block_count = tamanho;
								memory[position.row][position.col].position = {row: position.col, col: position.row};
								memory[position.row][position.col].color = random_color;
								memory[position.row][position.col].date_time = get_date_time_from_timestamp();

								textSize(20);
								fill(random_color);
								text(name, position.row*70, position.col*70, 70, 70);

								memory[position.row][position.col].info = 1;
							} else {
								var position = get_next_position_to_insert(last_position);
								while(memory[position.row][position.col].used == 1) {
									position = get_next_position_to_insert(position);
								}
								last_position = position;

								memory[position.row][position.col].id = id;
								memory[position.row][position.col].used = 1;
								memory[position.row][position.col].name = name;
								memory[position.row][position.col].size = size;
								memory[position.row][position.col].block_count = tamanho;
								memory[position.row][position.col].position = {row: position.col, col: position.row};
								memory[position.row][position.col].color = random_color;
								memory[position.row][position.col].date_time = get_date_time_from_timestamp();

								rect(position.row*70, position.col*70, 70, 70);

								memory[position.row][position.col].info = 0;
							}
						}

						textSize(12);
						text("id: " + id + "\nname: " + name, 0, column_to_insert*70, 70, 70);

						id++;


						if(FLAG_MOSTRA_ALOCACAO) {
							FLAG_MOSTRA_ALOCACAO = false;

							setTimeout(function(){
								$(".allocate-button").trigger("click");
							}, 1000);
						}


						size = Math.floor(parseInt(size));

						var used_size = $("#used_size").find('big').text().get_number();
						used_size += size;
						$("#used_size").find('big').html(used_size.format(0, ".", ".") + " bytes");
						$("#used_size").find('small').html('(' + used_size.bytes_to_size() + ')');


						var free_size = $("#free_size").find('big').text().get_number();
						free_size -= size;
						$("#free_size").find('big').html(free_size.format(0, ".", ".") + " bytes");
						$("#free_size").find('small').html('(' + free_size.bytes_to_size() + ')');

						$(function(){
						  	$("#pieChart").empty().drawPieChart([
						  		{ title: "Espaço livre", value : 80, color: "#969696" },
						    	{ title: "Espaço usado", value : 20, color: "#2C3E50" }
						  	]);
						});

					} else {
						alert("Tamanho indisponível na memória.");
					}
				}
			}
		});
	}


	function find_data() {
 		$("#find_data").on("click", function(e){
 			var id = $("#findId").val();
 			
 			if(id) {
 				if(check_id_exists(id)) {
 					var blocks = get_blocks_with_id(id);
 					
 					if(blocks.main.length > 0) {
 						var tamanho = block_size * (blocks.main[0].size / block_size)
 						var data = blocks.main[0].date_time;
 						var nome = blocks.main[0].name;
 						var numero_blocos = Math.ceil(blocks.main[0].block_count);

 						$(".file-info .form-group").empty();

 						$(".file-info .form-group").append("<p>- <strong>ID:</strong> " + id + ";</p>");
 						$(".file-info .form-group").append("<p>- <strong>Nome:</strong> " + nome + ";</p>");
 						$(".file-info .form-group").append("<p>- <strong>Tamanho do arquivo:</strong> " + tamanho + " bytes;</p>");
 						$(".file-info .form-group").append("<p>- <strong>Data de criação:</strong> " + data + ";</p>");
 						$(".file-info .form-group").append("<p>- <strong>Número de blocos alocados:</strong> " + numero_blocos + ".</p>");

 						$(".file-info").show();

 						if(FLAG_MOSTRA_ACESSO) {
 							FLAG_MOSTRA_ACESSO = false;

 							setTimeout(function(){
								$(".access-button").trigger("click");
							}, 1000);
 						}
 					}					
 				} else {
 					$(".file-info").hide();
 					alert("O arquivo não foi encontrado.");
 				}
 			}
 		});
	}



	function delete_data() {
		$("#delete_data").on("click", function(e){
			$(".file-info").hide();
			var id = $("#deleteId").val();

			if(id) {
				if(check_id_exists(id)) {
					fill("#fff");
					var blocks = get_blocks_with_id(id);


					// Bloco do filesystem
					var fs_block = blocks.filesystem;
					if(fs_block.length > 0) {
						fs_block = fs_block[0];
						rect(0, fs_block.column*70, 70, 70);

						_filesystem[fs_block.column].used = 0;
						delete _filesystem[fs_block.column].id;
						delete _filesystem[fs_block.column].name;
						delete _filesystem[fs_block.column].color;
						delete _filesystem[fs_block.column].column;
					}

					// Bloco principal na memória
					var main_block = blocks.main;
					if(main_block.length > 0) {
						for(var i=0; i<main_block.length; i++) {
							rect(main_block[i].position.col*70, main_block[i].position.row*70, 70, 70);

							memory[main_block[i].position.col][main_block[i].position.row].used = 0;
						}
					}

					// Blocos "coloridos" da memória
					var secondary_blocks = blocks.secondary;
					if(secondary_blocks.length > 0) {
						for(var i=0; i<secondary_blocks.length; i++) {
							rect(secondary_blocks[i].position.col*70, secondary_blocks[i].position.row*70, 70, 70);

							memory[secondary_blocks[i].position.col][secondary_blocks[i].position.row].used = 0;
						}
					}


					// Decrementa número de blocos disponíveis
					used_places -= main_block[0].block_count;


					if(FLAG_MOSTRA_EXCLUSAO) {
						FLAG_MOSTRA_EXCLUSAO = false;

						setTimeout(function(){
							$(".delete-button").trigger("click");
						}, 1000);
					}
				} else {
					$(".file-info").hide();
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

