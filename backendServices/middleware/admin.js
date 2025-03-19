import User from "../models/userModel.js";

async function isAdmin (req, res, next) {
    const userAd = await User.findById( req.user._id );
    console.log(userAd);
    if(!userAd.isAdmin) return res.status(403).send('Access is Forbidden');
    next();
}

export default isAdmin;