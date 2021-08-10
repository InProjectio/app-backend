const EmojiActRoute = require('express').Router();
const EmojiController = require('./controller');

EmojiActRoute.post('/', EmojiController.createEmojiAct);
EmojiActRoute.get('/list', EmojiController.getListEmojiAct);
EmojiActRoute.get('/:id', EmojiController.getEmojiActDetail);
EmojiActRoute.put('/:id', EmojiController.updateEmojiActById);
EmojiActRoute.delete('/:id', EmojiController.deleteEmojiActById);

module.exports = EmojiActRoute;
