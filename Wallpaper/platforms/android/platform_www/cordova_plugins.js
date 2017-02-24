cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-wallpaper.wallpaper",
        "file": "plugins/cordova-plugin-wallpaper/www/wallpaper.js",
        "pluginId": "cordova-plugin-wallpaper",
        "clobbers": [
            "wallpaper"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-wallpaper": "0.1.0",
    "cordova-plugin-whitelist": "1.3.1"
};
// BOTTOM OF METADATA
});