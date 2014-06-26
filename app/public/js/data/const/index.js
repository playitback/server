define('const/index', ['const/state', 'const/type', 'const/watchstatus'], function(State, Type, WatchStatus) {
	
	return {
		State:			State,
		Type:			Type,
		WatchStatus: 	WatchStatus
	};
	
});