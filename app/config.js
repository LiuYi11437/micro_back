module.exports = {
  secret: "zhihu-jwt-secret",
  connectionStr:
    process.env.NODE_ENV !== "development"
      ? "mongodb+srv://liuyi:liuyi123@liuyi-ojjbr.mongodb.net/test?retryWrites=true&w=majority"
      : "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
  // connectionStr:"mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
  // "mongodb+srv://lewis:mukewang@zhihu-kag3y.mongodb.net/test?retryWrites=true",
};
