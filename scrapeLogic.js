const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (req, res) => {
  const nik = req.params.nik;
  // Run in Local
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   args: [

  //   ]
  // });

  // Run in server
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
    ],
    executablePath:
        process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
  });

  try {
    
    const page = await browser.newPage();

    await page.goto('https://cekdptonline.kpu.go.id/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    await page.waitForSelector('#__BVID__22');
    await page.type('#__BVID__22', nik);

    // Klik tombol "Pencarian"
    await page.click('button.btn:nth-child(2)');

    // Menunggu hingga data muncul di halaman
    await page.waitForSelector('.list-item-heading');

    // Mengambil dan menyimpan data dari halaman ke dalam array
    const namaElement = await page.$('.list-item-heading + p:nth-child(3)');
    const tpsElement = await page.$('.list-item-heading + p:nth-child(12)');

    const nama = await page.evaluate(el => el.textContent, namaElement);

    // Pemisahan data TPS
    const dataTps = await page.evaluate(el => el.textContent, tpsElement);

    const tpsInfo = dataTps.trim().split(',');

    const tpsPatch = tpsInfo[0].trim().split(':'); // Mengambil TPS
    const tps = tpsPatch[1].trim(); // Mengambil No TPS
    const kelDesa = tpsInfo[1].trim(); // Mengambil Kel/Desa
    const kecamatan = tpsInfo[2].trim(); // Mengambil Kecamatan
    const kabupaten = tpsInfo[3].trim(); // Mengambil Kabupaten

    const data = [nik, nama, tps, kelDesa, kecamatan, kabupaten];

    console.log(data);

    res.send(data);

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    console.log('Tutup browser');
    await browser.close();
  }
};
 
module.exports = { scrapeLogic };