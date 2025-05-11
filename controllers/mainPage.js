exports.getHomePage = (request, response, next) => {
  response.sendFile("home.html", { root: "views" });
};
exports.getErrorPage = (request, response, next) => {
  response.sendFile("notFound.html", { root: "views" });
};
