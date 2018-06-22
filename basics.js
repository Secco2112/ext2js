function get_first_id_column_available(){
	var returned_column = null;
	for(var i=0; i<_filesystem.length; i++){
		var el = _filesystem[i];
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


function get_position_to_insert(){
	for(var i=0; i<rows; i++) {
		for(var j=0; j<cols; j++) {
			if(i != 0) {
				if(memory[i][j].used == 0) {
					if(i > 6) {
						i=0;
						j++;
					}
					return {row: i, col: j};
				}
			}
		}
	}
	return null;
}