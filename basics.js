function get_first_id_column_available() {
	var returned_column = null;
	for(var i=0; i<_filesystem.length; i++){
		var el = _filesystem[i].used;
		if(el == 0){
			returned_column = i;
			break;
		}
	}
	return returned_column;
}



function get_random_color() {
  	var letters = '0123456789ABCDEF';
  	var color = '#';
  	for (var i = 0; i < 6; i++) {
    	color += letters[Math.floor(Math.random() * 16)];
  	}
  	while(color == "#000000"){
	  	color = "#";
	  	for (var i = 0; i < 6; i++) {
	    	color += letters[Math.floor(Math.random() * 16)];
	  	}
	}
  	return color;
}


function get_position_to_insert() {
	for(var i=0; i<cols; i++) {
		for(var j=0; j<rows; j++) {
			if(i != 0) {
				if(memory[i][j].used == 0) {
					return {row: i, col: j};
				}
			}
		}
	}
	return null;
}


function get_random_position_to_insert() {
	var column = Math.floor((Math.random() * 16) + 1);
	var row = Math.floor((Math.random() * 7));

	while(memory[column][row].used == 1) {
		column = Math.floor((Math.random() * 16) + 1);
		row = Math.floor((Math.random() * 7));
	}

	return {row: column, col: row};
}


function check_id_exists(id) {
	return _filesystem[id].used == 1;
}


function get_blocks_with_id(id) {
	var blocks = { filesystem: [], main: [], secondary: []};

	for(var i=0; i<cols; i++) {
		for(var j=0; j<rows; j++) {
			if(i != 0) {
				if(memory[i][j].id == id) {
					if(memory[i][j].info == 1) {
						blocks.main.push(memory[i][j]);
					} else {
						blocks.secondary.push(memory[i][j]);
					}
				}
			}
		}
	}

	for(var i=0; i<_filesystem.length; i++) {
		if(_filesystem[i].id == id) {
			if(_filesystem[i].used == 1) {
				blocks.filesystem.push(_filesystem[i]);
			}
		}
	}

	return blocks;
}