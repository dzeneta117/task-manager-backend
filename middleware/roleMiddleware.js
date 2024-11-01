// middleware/roleMiddleware.js
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Pretpostavlja se da se u `req.user` nalazi info o korisniku nakon JWT validacije

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access forbidden: insufficient privileges' });
        }

        next();
    };
};

module.exports = roleMiddleware;
