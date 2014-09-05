var nameScores = require('../const/name_scores');

module.exports = function(media, data) {
	
	var nameScore = function(name, year) {
		var score = 0;
		
		// Check for specific words in the name
		for(var key in nameScores) {
			if(name.indexOf(key) !== false) {
				score += nameScores[key];
			}
		}
		
		// Check for a matching year
		if(name.indexOf(year) !== false) {
			score += 5;
		}
		
		return score;
	};
	
	var sizeScore = function() {
		var score = 0;
		
		return score;
	};
	
	var providerScore = function() {
		var score = 0;
		
		return score;
	};
	
	var duplicateScore = function(torrentName, movieName) {
		var score = 0;
		
		var torrentNameSplit = torrentName.split(' ');
		
		return score;
	};
	
	var seederScore = function(seeders, leechers) {
		var score = 0;
		
		score += seeders * 100 / 15;
		score += leechers * 100 / 30;
		
		return score;
	};
	
	var score = 0;
	
	score += nameScore(data.magnet.dn, data.year);
	score += sizeScore();
	score += providerScore();
	score += duplicateScore(data.magnet.dn, media.name);
	score += seederScore(media.seeders, media.leechers);
	
	return score;
	
}