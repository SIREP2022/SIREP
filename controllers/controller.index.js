let controllerIndex = {};

controllerIndex.renderIndex = (req, resp) => {
    resp.render('index');
}
controllerIndex.adminIndex = (req, resp) => {
    resp.render('admin/index', /* {profile: req.session} */);
}
controllerIndex.perfil = (req, resp) => {
    resp.render('admin/perfil', {profile: req.session.user});
}

module.exports = controllerIndex;