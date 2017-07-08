var PLAYER_STATE = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    LOADED: 'LOADED',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED',
    ERROR: 'ERROR'
};

var PlayerHandler = function(castPlayer) {

}

var CastPlayer = function() {

}

CastPlayer.prototype.initializeCastPlayer = function() {
	console.log('initializeCastPlayer')

	var cast = window.cast;
	var chrome = window.chrome;
	console.log('\tcast', cast)

    var options = {};

    // Set the receiver application ID to your own (created in the
    // Google Cast Developer Console), or optionally
    // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    options.receiverApplicationId = '4F8B3483';

    // Auto join policy can be one of the following three:
    // ORIGIN_SCOPED - Auto connect from same appId and page origin
    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
    // PAGE_SCOPED - No auto connect
    options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

    cast.framework.CastContext.getInstance().setOptions(options);

    this.remotePlayer = new cast.framework.RemotePlayer();
    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
    
    console.log('remotePlayerController', this.remotePlayerController)
    this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        this.switchPlayer.bind(this)
    );
}

CastPlayer.prototype.switchPlayer = function() {

	var cast = window.cast;
	var chrome = window.chrome;
    // this.stopProgressTimer();
    // this.resetVolumeSlider();
    // this.playerHandler.stop();
    this.playerState = PLAYER_STATE.IDLE;
    if (cast && cast.framework) {
        if (this.remotePlayer.isConnected) {
            // this.setupRemotePlayer();
            return;
        }
    }
    // this.setupLocalPlayer();
};

export default CastPlayer