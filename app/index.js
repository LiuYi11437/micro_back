const Koa = require("koa");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const path = require("path");
const error = require("koa-json-error");
const routing = require("./routes");
const { connectionStr } = require("./config");

mongoose.connect(connectionStr, { useNewUrlParser: true }, () =>
  console.log("MongoDB 连接成功了！")
);
mongoose.connection.on("error", console.error);

const app = new Koa();
app.use(koaStatic(path.join(__dirname, "public")));

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true,
    },
  })
);

app.use(cors());

app.use(parameter(app));
routing(app);

app.listen(3000, () => console.log("程序启动在3000端口了"));
