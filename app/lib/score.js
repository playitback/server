var nameScores = require('../const/name_scores');

/**
 * Based on https://github.com/RuudBurger/CouchPotatoServer/blob/master/couchpotato/core/plugins/score/scores.py
 *
 * @param media
 * @param data
 * @returns {number}
 */

module.exports = function(media, data) {

	var TAG = 'const.score ';

	/**
	 * Check for words from the name_scores and calculate count for each of the words found.
	 * Same for year.
	 *
	 * @param name
	 * @param year
	 * @returns {number}
	 */
	var nameScore = function(name, year) {
		name = name.toLocaleLowerCase();

		var score = 0;
		
		// Check for specific words in the name
		for(var key in nameScores) {
			if(name.indexOf(key.toLowerCase()) > -1) {
				score += nameScores[key];
			}
		}
		
		// Check for a matching year
		if(name.indexOf(year) > -1) {
			score += 5;
		}
		
		return score;
	};

	/**
	 * Calculate a score based on number of words in the torrent in comparison to the movie name.
	 *
	 * @param torrentName
	 * @param movieName
	 * @returns {number}
	 */
	var nameRatioScore = function(torrentName, movieName) {
		var torrentWords = torrentName.split(/\W+/);
		var movieWords = movieName.split(/\W+/);

		return 10 - (torrentWords.length - movieWords.length);
	};

	/**
	 * Calculate a score based on words in the torrent name.
	 *
	 * @param torrentName
	 * @param movieName
	 * @returns {number}
	 */
	var namePositionScore = function(torrentName, movieName, movieYear) {
		var score = 0;

		// Strip any non alpha-numeric characters and spaces
		torrentName = torrentName.replace(/[^A-Za-z0-9_\s]+/, '');
		movieName = movieName.replace(/[^A-Za-z0-9_\s]+/, '');

		var torrentWords = torrentName.split(/\W+/);
		var qualities = {};

		// Give points for movies beginning with the correct name
		if (torrentName.trim().indexOf(movieName) == 0) {
			score += 10;
		}

		// If year is second in line, give more points
		if (torrentName.replace(movieName, '').indexOf(movieYear) == 0) {
			score += 10;
		}

		// Give -point to crap between year and quality


		return score;
	};

	/**
	 * If a size is set, don't adjust score. Otherwise return -20
	 *
	 * @param size
	 * @returns {number}
	 */
	var sizeScore = function(size, sizeUnit) {
		if (typeof size != 'number') {
			return 0;
		}

		// Convert GB to MB
		if (sizeUnit == 'GiB') {
			size *= 1024;
		}

		return (typeof size == 'number' && size > 0 ? 0 : -20);
	};

	/**
	 * Returns a specific score for certain providers.
	 * Not in use.
	 *
	 * @returns {number}
	 */
	var providerScore = function() {
		var score = 0;
		
		return score;
	};

	/**
	 * Checks for duplicate words in the torrent name and calculates a score based on remaining words
	 *
	 * @param torrentName
	 * @param movieName
	 * @returns {number}
	 */
	var duplicateScore = function(torrentName, movieName) {
		var torrentNameSplit = torrentName.split(/\W+/),
			movieNameSplit = movieName.split(/\W+/),
			duplicateCount = 0;

		for (var w in torrentNameSplit) {
			if (torrentName.indexOf(torrentNameSplit[w]) > -1) {
				duplicateCount++;
			}
		}
		
		return (duplicateCount - movieNameSplit.length) * -4;
	};

	/**
	 * Calculate score based on words being ignored
	 * Not currently used.
	 *
	 * @returns {number}
	 */
	var partialIgnoredScore = function() {
		return 0;
	};

	/**
	 * Calculate score based on number of seeders and leechers.
	 *
	 * @param seeders
	 * @param leechers
	 * @returns {number}
	 */
	var seederScore = function(seeders, leechers) {
		var score = 0;

		score += seeders * 100 / 15;
		score += leechers * 100 / 30;
		
		return score;
	};

	var score = 0;
	var type = media.type;

	var mediaTitle;

	if (type == 'tv') {
		mediaTitle = media.showName + ' ' + media.showYear + ' ' +
			'S' + (media.seasonNumber < 10 ? '0' : '') + media.seasonNumber +
			'E' + (media.number < 10 ? '0' : '') + media.number;
	}
	else if (type == 'movie') {
		mediaTitle = media.title;
	}

	score += nameRatioScore(data.magnet.dn, mediaTitle);
	score += namePositionScore(data.magnet.dn, mediaTitle, media.availableDate.getFullYear());
	score += duplicateScore(data.magnet.dn, mediaTitle);
	score += nameScore(data.magnet.dn, data.year);
	score += sizeScore(data.size, data.sizeUnit);
	score += providerScore();
	score += partialIgnoredScore();
	score += seederScore(data.seeds, data.leaches);

	return score;
	
}