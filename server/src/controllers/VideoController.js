module.exports = {
  upload (req, res) {
    console.log(req.file)

    const mimetypes = [
      'video/3gpp',
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/quicktime',
      'video/mpeg',
      'video/webm',
      'video/x-m4v',
      'video/ms-asf',
      'video/x-ms-wmv',
      'video/x-msvideo']

    if (!mimetypes.includes(req.file.mimetype)){
      return res.status(400).send({
        error: 'The type of the file is not supported'
      })
    }

    upload(req, res, function(err) {
       if (err) {
           return res.end("Something went wrong!");
       }
       return res.end("File uploaded sucessfully!.");
    })
  }
}
