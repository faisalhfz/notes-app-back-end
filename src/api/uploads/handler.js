const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);

      const filename = await this._service.writeFile(data, data.hapi);

      const response = h.response({
        status: 'success',
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }

    // async putNoteUploadHandler(request, h) {
    //   this._validator.validateUploadPayload(request.payload);

    //   const { id } = request.params;

    //   const { id: credentialId } = request.auth.credentials;

    //   await this._notesService.verifyNoteAccess(id, credentialId);

    //   const { file } = request.payload;

    //   const uploadId = await this._storageService.uploadFile(file, id);

    //   return {
    //     status: 'success',
    //     message: 'File berhasil di upload',
    //     data: {
    //       uploadId,
    //     },
    //   };
  }
}

module.exports = UploadsHandler;
