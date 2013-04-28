import AudioManager;

exports.sound = null;

exports.getSound = function () {
  if (!exports.sound) {
    exports.sound = new AudioManager({
      path: 'resources/sounds',
      files: {
        laser: {
          path: 'effect',
          background: false,
          volume: 0.4
        },
        enemy_out: {
          path: 'effect',
          background: false,
          volume: 0.7
        }
      }
    });
  }
  return exports.sound;
};