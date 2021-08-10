const AttachmentRoute = require('express').Router();
const AttController = require('./controller');
const multer = require('multer');
const { storage } = require('../../configs/upload');
const { withValidation } = require('../../middlewares/validation');
const { useToken } = require('../../middlewares/token');
const upload = multer({
  storage,
});

AttachmentRoute.use(useToken);

// GET
AttachmentRoute.get(
  '/get-attachment',
  withValidation(AttController.getAttachment)
);
AttachmentRoute.get('/list', AttController.getAttList);
AttachmentRoute.get('/txhash/:txHash', AttController.getAttByTxHash);
AttachmentRoute.get('/:id/is-deleted', AttController.checkDeletedOrNot);
AttachmentRoute.get('/:id/txhash', AttController.getTxHashById);
AttachmentRoute.get('/:id/task-id', AttController.getTaskIdById);
AttachmentRoute.get('/:id/user-id', AttController.getUserIdById);
AttachmentRoute.get('/:id', AttController.getAttById);
// POST
AttachmentRoute.post('/', AttController.createNewAtt);
AttachmentRoute.post(
  '/upload',
  upload.array('attachments', 5),
  withValidation(AttController.uploadAttachments)
);

// PUT
AttachmentRoute.put('/:id', AttController.updateById);

// DELETE
AttachmentRoute.delete('/:id', AttController.deleteById);

module.exports = AttachmentRoute;
