const fs = require("fs");
const JSZip = require("jzip");
const path = require("path");
const Docxtemplater = require("docxtemplater");
const compressing = require("compressing");

function buildWord(params, fileName, i, docType) {
  let type = "";
  let hz = "";
  if (docType == "起诉状") {
    if (i >= 1 && i < 5) {
      hz = "-" + params.bgName;
    }
    if (i == 1) {
      if (!params.wzfbf || !parseInt(params.wzfbf)) {
        params.wzfbf = 0;
      }
      if (params.hjd == "" && params.wzfbf == 0) {
        type += "1";
      } else if (params.hjd == "" && params.wzfbf !== 0) {
        type += "2";
      } else if (params.hjd !== "" && params.wzfbf == 0) {
        type += "3";
      } else if (params.hjd !== "" && params.wzfbf !== 0) {
        type += "4";
      }
    }
    if (i == 2) {
      params.dlr2Name = "   ";
      if (params.dlr2[1].name) {
        params.dlr2Name = params.dlr2[1].name;
      }
    }
    if (i == 3) {
      if (params.hjd == "") {
        type += "1";
      } else {
        type += "2";
      }
    }
  }

  var content = fs.readFileSync(
    path.join(__dirname, `../public/template/${docType}/${fileName}${type}.docx`),
    "binary"
  );
  var zip = new JSZip(content);
  var doc = new Docxtemplater();
  doc.loadZip(zip);
  doc.setData(params);
  try {
    doc.render();
  } catch (error) {
    var err = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties
    };
    console.log(JSON.stringify(err));
    throw error;
  }
  var buf = doc.getZip().generate({ type: "nodebuffer" });
  fs.writeFileSync(
    path.join(__dirname, `../public/output/${docType}/${fileName}${hz}.docx`),
    buf
  );
}

function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
  }
}

async function getQszDocs(params) {
  await delDir(path.join(__dirname, `../public/output/起诉状/`));
  let files = [
    "1、法定代表人证明书",
    "2、民事起诉状",
    "3、授权委托书",
    "4、保全申请书",
    "担保函",
    "证据目录"
  ];
  params.finalDlr = params.dlr2[0].value;
  params.finalDlr2 = params.dlr2[1].value;
  params.yg2 = params.yg2.trim() + "                         ";
  files.forEach((file, i) => {
    buildWord(params, file, i, "起诉状");
  });
  await zipFolder(
    path.join(__dirname, `../public/output/起诉状`),
    path.join(__dirname, `../public/output/result/result.zip`)
  );
}

async function getSsclDocs(params) {
  await delDir(path.join(__dirname, `../public/output/诉讼材料`));
  let files = [
    "担保函",
    "调查令申请书",
    "公告送达申请书（程茜茜签字版）",
    "强制执行阶段授权委托书",
    "强制执行申请书",
    "所函",
    "网络查扣申请书"
  ];
  let data = {
    ...params.beigao,
    ...params.yuangao
  };
  files.forEach((file, i) => {
    buildWord(data, file, i, "诉讼材料");
  });
  await zipFolder(
    path.join(__dirname, `../public/output/诉讼材料`),
    path.join(__dirname, `../public/output/result/result.zip`)
  );
}

function zipFolder(inputFolder, outPutZip) {
  return new Promise((resolve, reject) => {
    compressing.zip
      .compressDir(inputFolder, outPutZip)
      .then(res => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
}

function SaveImage(params){
  console.log(params)
}

module.exports = {
  getQszDocs,
  getSsclDocs,
  SaveImage
};
