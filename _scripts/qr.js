const QRCode = require('qrcode');

async function qr(el) {
    el.addAsyncShortcode("qr", (data, classes) => {
        return new Promise((resolve, reject) => {
            return QRCode.toString(data, {
                type: 'svg'
            })
                .then(url => {
                    const encoded = encodeURIComponent(url)
                        .replace(/'/g, '%27')
                        .replace(/"/g, '%22')

                    const header = 'data:image/svg+xml,'
                    const dataUrl = header + encoded
                    resolve(`<img src='${dataUrl}' class='${classes}'>`);
                })
                .catch(reject);
        });
    });
}

module.exports = {
    qr
};
