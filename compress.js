const imagemin = require('imagemin');
// const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const mongo = require('mongodb');
const Grid = require('gridfs-stream');
const fs = require('fs');

imagemin(['screenshots/*.png'], 'build/images', {
    plugins: [
        // imageminMozjpeg({targa: true}),
        imageminPngquant({ quality: '65-80' })
    ]
}).then(files => {
    console.log(files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    var db = new mongo.Db('screenshots', new mongo.Server("127.0.0.1", 27017));

    db.open(function(err) {
        if (err) return handleError(err);
        var gfs = Grid(db, mongo);

        // all set!
        files.forEach(function(file) {
            var writestream = gfs.createWriteStream({
                filename: file.path.split('\\')[2]
            });
            fs.createReadStream(file.path).pipe(writestream);

            writestream.on('close', function(file) {
                // do something with `file`
                console.log(file.filename);

                gfs.exist({filename: file.filename}, function (err, found) {
				  if (err) return handleError(err);
				  found ? console.log('File exists') : console.log('File does not exist');
				});
            });
        })

    })

});
