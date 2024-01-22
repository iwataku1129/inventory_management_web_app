const routeGuard = (accessMatrix) => {
    return (req, res, next) => {
        if (!req.authInfo.hasOwnProperty('roles')) {
            return res.status(403).json({ error: 'No roles claim found!' });
        }

        const roles = req.authInfo['roles'];

        if (!requestHasRequiredAttributes(accessMatrix, req.path, req.method, roles)) {
            return res.status(403).json({ error: 'User does not have the role, method or path' });
        }

        next();
    };
};

/**
 * This method checks if the request has the correct roles, paths and methods
 * @param {Object} accessMatrix
 * @param {String} path
 * @param {String} method
 * @param {Array} roles
 * @returns boolean
 */
const requestHasRequiredAttributes = (accessMatrix, path, method, roles) => {
    const accessRules = Object.values(accessMatrix);
    for (const accessRule of accessRules) {
        // AuthConfigから該当のPath取得
        if (path.includes(accessRule.path)) {
            // 対象methodのrole取得
            const roleTmp = accessRule.methods[method]
            // role一致確認
            if (roles.filter(item => roleTmp.indexOf(item) > -1 && roles.indexOf(item) > -1).length > 0) {
                return true
            }
        }
    }
    return false;
};

module.exports = routeGuard;
