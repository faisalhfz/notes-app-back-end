const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');
const { Pool } = require('pg');

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  // async uploadFile(file, noteId) {
  //   const name = file.hapi.filename;
  //   const filepath = path.join(__dirname, '..', '..', 'uploads', name);
  //   const fileStream = fs.createWriteStream(filepath);

  //   file.pipe(fileStream);

  //   const id = `upload-${nanoid(16)}`;

  //   const query = {
  //     text: 'INSERT INTO uploads VALUES ($1, $2, $3, $4) RETURNING id',
  //     values: [id, noteId, name, filepath],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows[0].id) {
  //     throw new InvariantError('Catatan gagal ditambahkan');
  //   }

  //   return result.rows[0].id;
  // }

  // async removeFileFromStorage(filename) {}
}

module.exports = StorageService;
